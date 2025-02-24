import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import {
  SSIconBlackIndicator,
  SSIconGreenIndicator,
  SSIconYellowIndicator
} from '@/components/icons'
import SSAccountCard from '@/components/SSAccountCard'
import SSButton from '@/components/SSButton'
import SSSeparator from '@/components/SSSeparator'
import SSText from '@/components/SSText'
import useVerifyConnection from '@/hooks/useVerifyConnection'
import SSHStack from '@/layouts/SSHStack'
import SSMainLayout from '@/layouts/SSMainLayout'
import SSVStack from '@/layouts/SSVStack'
import { t } from '@/locales'
import { useAccountBuilderStore } from '@/store/accountBuilder'
import { useAccountsStore } from '@/store/accounts'
import { Colors } from '@/styles'
import { sampleSignetWalletSeed } from '@/utils/samples'

export default function AccountList() {
  const router = useRouter()
  const [accounts, addAccount, updateAccount, syncWallet] = useAccountsStore(
    useShallow((state) => [
      state.accounts,
      state.addAccount,
      state.updateAccount,
      state.syncWallet
    ])
  )

  const [
    setName,
    setPassphrase,
    setScriptVersion,
    setSeedWordCount,
    setSeedWords,
    loadWallet,
    encryptSeed,
    getAccount
  ] =
    useAccountBuilderStore(
      useShallow((state) => [
        state.setName,
        state.setPassphrase,
        state.setScriptVersion,
        state.setSeedWordCount,
        state.setSeedWords,
        state.loadWallet,
        state.encryptSeed,
        state.getAccount
      ])
    )

  const [loadingWallet, setLoadingWallet] = useState('')

  async function loadSampleSignetLegacyWallet() {
    setScriptVersion('P2PKH')
    await loadSampleSignetWallet('legacy')
  }

  async function loadSampleSignetSegwitWallet() {
    setScriptVersion('P2WPKH')
    await loadSampleSignetWallet('segwit')
  }

  async function loadSampleSignetWallet(walletType: string) {
    if (loadingWallet !== '') return
    setLoadingWallet(walletType)
    setName(`My Wallet (${walletType})`)
    setPassphrase('')
    setSeedWordCount(12)
    setSeedWords(sampleSignetWalletSeed)
    const wallet = await loadWallet()
    await encryptSeed()
    const account = getAccount()
    await addAccount(account)
    setLoadingWallet('')

    try {
      const syncedAccount = await syncWallet(wallet, account)
      await updateAccount(syncedAccount)
    } catch {
      //
    }
  }

  const [connectionState, connectionString, isPrivateConnection] =
    useVerifyConnection()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SSText uppercase style={{ letterSpacing: 1 }}>
              {t('app.name')}
            </SSText>
          )
        }}
      />
      <SSHStack style={{ justifyContent: 'center', gap: 0, marginBottom: 24 }}>
        {connectionState ? (
          isPrivateConnection ? (
            <SSIconYellowIndicator height={24} width={24} />
          ) : (
            <SSIconGreenIndicator height={24} width={24} />
          )
        ) : (
          <SSIconBlackIndicator height={24} width={24} />
        )}
        <SSText
          size="xxs"
          uppercase
          style={{
            color: connectionState ? Colors.gray['200'] : Colors.gray['450']
          }}
        >
          {connectionString}
        </SSText>
      </SSHStack>
      <SSHStack style={{ paddingHorizontal: '5%' }}>
        <View style={{ flex: 1 }}>
          <SSButton
            label={t('account.add')}
            style={{
              borderTopWidth: 1,
              borderTopColor: '#303030',
              borderBottomWidth: 1,
              borderBottomColor: '#222222'
            }}
            onPress={() => router.navigate('/addMasterKey/')}
            variant="gradient"
            gradientType="special"
          />
        </View>
      </SSHStack>
      <SSMainLayout style={{ paddingHorizontal: '5%', paddingTop: 16 }}>
        <ScrollView>
          {accounts.length === 0 && (
            <SSVStack itemsCenter>
              <SSText color="muted" uppercase>
                {t('accounts.empty')}
              </SSText>
              <SSButton
                label={t('account.load.sample.segwit')}
                variant="ghost"
                style={{ borderRadius: 0 }}
                onPress={loadSampleSignetSegwitWallet}
                disabled={loadingWallet !== ''}
                loading={loadingWallet === 'segwit'}
              />
              <SSButton
                label={t('account.load.sample.legacy')}
                variant="ghost"
                style={{ borderRadius: 0 }}
                onPress={loadSampleSignetLegacyWallet}
                disabled={loadingWallet !== ''}
                loading={loadingWallet === 'legacy'}
              />
            </SSVStack>
          )}
          <SSVStack>
            {accounts.map((account) => (
              <SSVStack key={account.name}>
                <SSAccountCard
                  account={account}
                  onPress={() => router.navigate(`/account/${account.name}`)}
                />
                <SSSeparator color="gradient" />
              </SSVStack>
            ))}
          </SSVStack>
        </ScrollView>
      </SSMainLayout>
    </>
  )
}
