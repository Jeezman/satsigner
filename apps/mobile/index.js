import { registerRootComponent } from 'expo'

import App from '@'

require('./ReactotronConfig')
// if (__DEV__) {
//   require('./ReactotronConfig')
// }

registerRootComponent(App)
