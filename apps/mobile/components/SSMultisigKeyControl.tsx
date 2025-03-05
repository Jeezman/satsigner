import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'

import { SSIconAdd, SSIconGreen } from '@/components/icons'
import SSButton from '@/components/SSButton'
import SSText from '@/components/SSText'
import SSHStack from '@/layouts/SSHStack'
import SSVStack from '@/layouts/SSVStack'
import { t } from '@/locales'
import { type Key } from '@/types/models/Account'
import { formatAddress } from '@/utils/format'

type SSMultisigKeyControlProps = {
  isBlackBackground: boolean
  index: number
  keyCount: number
  creating: boolean
  keyDetails?: Key
}

function SSMultisigKeyControl({
  isBlackBackground,
  index,
  keyCount,
  creating,
  keyDetails
}: SSMultisigKeyControlProps) {
  const router = useRouter()

  // async function handleOnClickGenerate() {
  //   setCurrentParticipantIndex(index)
  //   setParticipantCreationType('generateMnemonic')
  //   router.navigate('/addMasterKey/participantOptions')
  // }

  // function handleOnClickImport() {
  //   setCurrentParticipantIndex(index)
  //   setParticipantCreationType('importMnemonic')
  //   router.navigate('/addMasterKey/participantOptions')
  // }

  // function handleOnClickImportDescriptor() {
  //   setCurrentParticipantIndex(index)
  //   setParticipantCreationType('importDescriptor')
  //   router.navigate('/addMasterKey/importDescriptor')
  // }

  function getSourceLabel() {
    if (!keyDetails) {
      return t('account.selectKeySource')
    } else if (keyDetails.creationType === 'generateMnemonic') {
      return t('account.seed.newSeed', {
        name: keyDetails.scriptVersion
      })
    } else if (keyDetails.creationType === 'importMnemonic') {
      return t('account.seed.importedSeed', { name: keyDetails.scriptVersion })
    } else if (keyDetails.creationType === 'importDescriptor') {
      return t('account.seed.external')
    }
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate(`/account/add/multiSig/keySettings/${index}`)
      }
    >
      <SSVStack
        style={[
          {
            borderColor: '#6A6A6A',
            borderTopWidth: 2,
            backgroundColor: isBlackBackground ? 'black' : '#1E1E1E',
            paddingHorizontal: 16,
            paddingBottom: 32,
            paddingTop: 16
          },
          index === keyCount - 1 && { borderBottomWidth: 2 }
        ]}
      >
        <SSHStack justifyBetween>
          <SSHStack style={{ alignItems: 'center' }}>
            {keyDetails ? (
              <SSIconGreen width={24} height={24} />
            ) : (
              <SSIconAdd width={24} height={24} />
            )}
            <SSText color="muted" size="lg">
              {t('common.key')} {index}
            </SSText>
            <SSVStack gap="none">
              <SSText>{getSourceLabel()}</SSText>
              <SSText color={keyDetails?.publicKey ? 'white' : 'muted'}>
                {keyDetails?.name ?? t('account.seed.noLabel')}
              </SSText>
            </SSVStack>
          </SSHStack>
          <SSVStack gap="none" style={{ alignItems: 'flex-end' }}>
            <SSText color={keyDetails?.fingerprint ? 'white' : 'muted'}>
              {keyDetails?.fingerprint ?? t('account.fingerprint')}
            </SSText>
            <SSText color={keyDetails?.publicKey ? 'white' : 'muted'}>
              {keyDetails?.publicKey
                ? formatAddress(keyDetails?.publicKey, 6)
                : t('account.seed.publicKey')}
            </SSText>
          </SSVStack>
        </SSHStack>
        {/* {collapsed &&
          (!creating || (creating && keyDetails) ? (
            <>
              <SSButton
                uppercase
                label={t('account.seed.dropAndKeep')}
                variant="outline"
              />
              <SSButton uppercase label={t('account.seed.sharePub')} />
              <SSButton uppercase label={t('account.seed.shareDescriptor')} />
            </>
          ) : (
            <></>
          ))} */}
      </SSVStack>
    </TouchableOpacity>
  )
}

export default SSMultisigKeyControl
