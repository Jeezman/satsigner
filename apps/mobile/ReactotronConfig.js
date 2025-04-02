import reactotronZustand from 'reactotron-plugin-zustand'
import Reactotron, {
  openInEditor,
  trackGlobalErrors
} from 'reactotron-react-native'

import { useAccountBuilderStore } from '@/store/accountBuilder'
import { useAccountStore } from '@/store/accounts'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { useTransactionBuilderStore } from '@/store/transactionBuilder'
import { useWalletsStore } from '@/store/wallets'

Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    //add this line 🙌
    reactotronZustand({
      stores: [
        { name: 'auth', store: useAuthStore },
        { name: 'accountBuilder', store: useAccountBuilderStore },
        { name: 'settings', store: useSettingsStore },
        // { name: 'account', store: useAccountStore },
        { name: 'wallets', store: useWalletsStore },
        { name: 'transactions', store: useTransactionBuilderStore }
      ],
      omitFunctionKeys: false
    })
  )
  .use(openInEditor())
  .use(trackGlobalErrors())
  .connect() // let's connect!
