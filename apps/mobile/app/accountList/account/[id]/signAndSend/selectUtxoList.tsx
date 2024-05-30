import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import SSButton from '@/components/SSButton'
import SSIconButton from '@/components/SSIconButton'
import SSSeparator from '@/components/SSSeparator'
import SSSortDirectionToggle from '@/components/SSSortDirectionToggle'
import SSText from '@/components/SSText'
import SSUtxoItem from '@/components/SSUtxoItem'
import SSHStack from '@/layouts/SSHStack'
import SSMainLayout from '@/layouts/SSMainLayout'
import SSVStack from '@/layouts/SSVStack'
import { i18n } from '@/locales'
import { useAccountStore } from '@/store/accounts'
import { useTransactionBuilderStore } from '@/store/transactionBuilder'
import { Colors } from '@/styles'
import { type Direction } from '@/types/logic/sort'
import { type Utxo } from '@/types/models/Utxo'
import { formatNumber } from '@/utils/format'
import { compareAmount, compareTimestamp } from '@/utils/sort'

type SortField = 'date' | 'amount'

export default function SelectUtxoList() {
  const accountStore = useAccountStore()
  const transactionBuilderStore = useTransactionBuilderStore()

  const [sortDirection, setSortDirection] = useState<Direction>('desc')
  const [sortField, setSortField] = useState<SortField>('amount')

  const largestValue = useMemo(
    () =>
      Math.max(...accountStore.currentAccount.utxos.map((utxo) => utxo.value)),
    [accountStore.currentAccount.utxos]
  )

  const utxosValue = (utxos: Utxo[]): number =>
    utxos.reduce((acc, utxo) => acc + utxo.value, 0)

  const utxosTotalValue = useMemo(
    () => utxosValue(accountStore.currentAccount.utxos),
    [accountStore.currentAccount.utxos]
  )
  const utxosSelectedValue = useMemo(
    () => utxosValue([...transactionBuilderStore.inputs]),
    [transactionBuilderStore.inputs]
  )

  function handleSelectAllUtxos() {
    for (const utxo of accountStore.currentAccount.utxos) {
      transactionBuilderStore.addInput(utxo)
    }
  }

  function sortUtxos(utxos: Utxo[]) {
    return utxos.sort((utxo1, utxo2) =>
      sortDirection === 'asc'
        ? sortField === 'date'
          ? compareTimestamp(utxo1.timestamp, utxo2.timestamp)
          : compareTimestamp(utxo2.timestamp, utxo1.timestamp)
        : sortField === 'date'
          ? compareAmount(utxo1.value, utxo2.value)
          : compareAmount(utxo2.value, utxo1.value)
    )
  }

  function handleOnDirectionChanged(field: SortField, direction: Direction) {
    setSortField(field)
    setSortDirection(direction)
  }

  function handleOnToggleSelected(utxo: Utxo) {
    const includesInput = transactionBuilderStore.hasInput(utxo)

    if (includesInput) transactionBuilderStore.removeInput(utxo)
    else transactionBuilderStore.addInput(utxo)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SSText uppercase>{accountStore.currentAccount.name}</SSText>
          )
        }}
      />
      <SSMainLayout style={{ flex: 0 }}>
        <SSVStack>
          <SSHStack justifyBetween>
            <SSText color="muted">Group</SSText>
            <SSText size="md">
              {i18n.t('signAndSend.selectSpendableOutputs')}
            </SSText>
            <SSIconButton>
              <Image
                style={{ width: 24, height: 22 }}
                source={require('@/assets/icons/bubbles.svg')}
              />
            </SSIconButton>
          </SSHStack>
          <SSVStack itemsCenter gap="sm">
            <SSVStack itemsCenter gap="xs">
              <SSText>
                {transactionBuilderStore.inputs.size}{' '}
                {i18n.t('common.of').toLowerCase()}{' '}
                {accountStore.currentAccount.utxos.length}{' '}
                {i18n.t('common.selected').toLowerCase()}
              </SSText>
              <SSHStack gap="xs">
                <SSText size="xxs" style={{ color: Colors.gray[400] }}>
                  {i18n.t('common.total')}
                </SSText>
                <SSText size="xxs" style={{ color: Colors.gray[75] }}>
                  {formatNumber(utxosTotalValue)}
                </SSText>
                <SSText size="xxs" style={{ color: Colors.gray[400] }}>
                  {i18n.t('bitcoin.sats').toLowerCase()}
                </SSText>
                <SSText size="xxs" style={{ color: Colors.gray[75] }}>
                  2.18
                </SSText>
                <SSText size="xxs" style={{ color: Colors.gray[400] }}>
                  USD
                </SSText>
              </SSHStack>
            </SSVStack>
            <SSVStack itemsCenter gap="none">
              <SSHStack gap="xs" style={{ alignItems: 'baseline' }}>
                <SSText
                  size="7xl"
                  color="white"
                  weight="ultralight"
                  style={{ lineHeight: 62 }}
                >
                  {formatNumber(utxosSelectedValue)}
                </SSText>
                <SSText size="xl" color="muted">
                  {i18n.t('bitcoin.sats').toLowerCase()}
                </SSText>
              </SSHStack>
              <SSHStack gap="xs" style={{ alignItems: 'baseline' }}>
                <SSText size="md" color="muted">
                  0.72
                </SSText>
                <SSText size="xs" style={{ color: Colors.gray[500] }}>
                  USD
                </SSText>
              </SSHStack>
            </SSVStack>
          </SSVStack>
        </SSVStack>
      </SSMainLayout>
      <SSSeparator color="grayDark" style={{ width: '100%', marginTop: 12 }} />
      <SSHStack justifyBetween style={{ paddingHorizontal: '5%' }}>
        <SSButton
          variant="ghost"
          label={`${i18n.t('common.selectAll').toUpperCase()} 3000 ${i18n.t('bitcoin.sats').toLowerCase()}`}
          style={{ width: 'auto' }}
          textStyle={{
            color: Colors.gray[75],
            textTransform: 'none',
            textDecorationLine: 'underline'
          }}
          onPress={() => handleSelectAllUtxos()}
        />
        <SSHStack gap="sm">
          <SSSortDirectionToggle
            label={i18n.t('common.date')}
            showArrow={sortField === 'date'}
            onDirectionChanged={(direction) =>
              handleOnDirectionChanged('date', direction)
            }
          />
          <SSSortDirectionToggle
            label={i18n.t('common.amount')}
            showArrow={sortField === 'amount'}
            onDirectionChanged={(direction) =>
              handleOnDirectionChanged('amount', direction)
            }
          />
        </SSHStack>
      </SSHStack>
      <View>
        <View style={styles.scrollBackgroundBase} />
        <ScrollView>
          {sortUtxos(accountStore.currentAccount.utxos).map((utxo) => (
            <SSUtxoItem
              key={`${utxo.txid}:${utxo.vout}`}
              utxo={utxo}
              selected={transactionBuilderStore.hasInput(utxo)}
              onToggleSelected={handleOnToggleSelected}
              largestValue={largestValue}
            />
          ))}
        </ScrollView>
      </View>
      <SSMainLayout style={styles.absoluteSubmitContainer}>
        <SSButton
          label="Add as inputs to message"
          variant="secondary"
          disabled={transactionBuilderStore.inputs.size === 0}
        />
      </SSMainLayout>
    </>
  )
}

const styles = StyleSheet.create({
  scrollBackgroundBase: {
    position: 'absolute',
    width: '100%',
    backgroundColor: Colors.gray[900],
    top: 2,
    height: 1000
  },
  absoluteSubmitContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.transparent
  }
})
