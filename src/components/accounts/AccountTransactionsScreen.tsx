import { useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import navUtils from '../../utils/NavUtils';
import { Typography, Colors, Layout } from '../../styles';
import { AppText } from '../shared/AppText';

import { AccountsContext } from './AccountsContext';
import numFormat from '../../utils/numFormat';
import BackgroundGradient from '../shared/BackgroundGradient';
import notImplementedAlert from '../shared/NotImplementedAlert';

import CameraIcon from '../../assets/images/camera.svg';
import RefreshIcon from '../../assets/images/refresh.svg';
import UpArrowIcon from '../../assets/images/up-arrow.svg';
import DownArrowIcon from '../../assets/images/down-arrow.svg';

interface Props {
  navigation: NavigationProp<any>;
}

export default function AccountTransactionsScreen({
  navigation
}: Props) {
  const context = useContext(AccountsContext);

  useEffect(() => {
    navUtils.setHeaderTitle(context.currentAccount.name, navigation);
  }, []);

  const GradientSeparator = () => <LinearGradient
    style={{width: '100%', height: 1}}
    colors={[Colors.grey61, Colors.grey38]}
    start={{x: 0, y: 0}}
    end={{x: 1.0, y: 0}}
  />;

  const ActionButton = (props: any) => <TouchableHighlight
    activeOpacity={0.65}
    underlayColor={Colors.grey38}
    style={[{
      width: '40%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }, props.style]}
    onPress={props.onPress}
  >
    {props.children}
  </TouchableHighlight>;

  return (
    <AccountsContext.Consumer>
      {({currentAccount: account}) => (
        <View style={styles.container}>
          <BackgroundGradient orientation={'horizontal'}>
            <View style={styles.header}>
              <View style={styles.currency}><AppText style={styles.sats}>{numFormat(account?.snapshot?.balanceSats)}</AppText><AppText style={styles.satsLabel}>sats</AppText></View>
              <View style={styles.currency}><AppText style={styles.usd}>{numFormat(account?.snapshot?.balanceUsd, 2)}</AppText><AppText style={styles.usdLabel}>USD</AppText></View>
            </View>
            <GradientSeparator />
            <View style={styles.actionBar}>
              <ActionButton style={{
                  borderRightWidth: 1,
                  borderRightColor: Colors.grey48,                
                }}
                onPress={notImplementedAlert}
              >
                <AppText style={styles.actionLabel}>Sign & Send</AppText>
              </ActionButton>
              <ActionButton
                style={{width: '20%'}}
                onPress={notImplementedAlert}
              >
                <CameraIcon width={18} height={13} />
              </ActionButton>
              <ActionButton style={{
                  borderLeftWidth: 1,
                  borderLeftColor: Colors.grey48,                
                }}
                onPress={notImplementedAlert}
              >
                <AppText style={styles.actionLabel}>New Invoice</AppText>
              </ActionButton>
            </View>
            <GradientSeparator />
            <View style={styles.tabs}>
              <View style={styles.metrics}>
                <View style={styles.metricContainer}>
                  <AppText style={[styles.metric, styles.metricSelected]}>{numFormat(account?.snapshot?.numTransactions)}</AppText>
                  <View>
                    <AppText style={[styles.metricLabel, styles.metricLabelSelected]}>Total{"\n"}Transactions</AppText>
                  </View>
                </View>
                <View style={styles.metricContainer}>
                  <AppText style={styles.metric}>{numFormat(account?.snapshot?.numAddresses)}</AppText>
                  <View>
                    <AppText style={styles.metricLabel}>Child{"\n"}Accounts</AppText>
                  </View>
                </View>
                <View style={styles.metricContainer}>
                  <AppText style={styles.metric}>{numFormat(account?.snapshot?.numUtxos)}</AppText>
                  <View>
                    <AppText style={styles.metricLabel}>Spendable{"\n"}Outputs</AppText>
                  </View>
                </View>
                <View style={styles.metricContainer}>
                  <AppText style={styles.metric}>{numFormat(account?.snapshot?.satsInMempool)}</AppText>
                  <View>
                    <AppText style={styles.metricLabel}>Sats in{"\n"}Mempool</AppText>
                  </View>
                </View>
              </View>
            </View>
            <GradientSeparator />
            <View style={[styles.metrics, styles.metricsNoMargin]}>
              {/* This view follows the structure of metrics defined above */}
              {/* its only purpose is to draw underline under transactions */}
              {/* but place it on top of the GradientSeparator, so it must come after in document order */}
              <View style={styles.metricContainer}>
                <View style={styles.metricUnderline}></View>
              </View>
              <View style={styles.metricContainer}></View>
              <View style={styles.metricContainer}></View>
              <View style={styles.metricContainer}></View>
            </View>
          </BackgroundGradient>
          <View style={styles.transactionsHeaderContainer}>
            <View style={styles.transactionsHeader}>
              <RefreshIcon width={18} height={18} />
              <AppText style={styles.transactionsHeaderText}>Parent Account Activity</AppText>
              <UpArrowIcon width={14} height={5} />
            </View>
          </View>
          <ScrollView style={styles.transactions}>
            <AppText>Transactions</AppText>
          </ScrollView>
        </View>
      )}
    </AccountsContext.Consumer>      
  );
}

const styles = StyleSheet.create({  
  container: {
    ...Layout.container.base
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    paddingBottom: 15
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1
  },
  sats: {
    ...Typography.fontFamily.sfProTextUltraLight,
    fontSize: 50,
    marginLeft: 40,
    color: Colors.white
  },
  satsLabel: {
    fontSize: 21,
    color: Colors.middleGrey,
    marginLeft: 0
  },
  usd: {
    fontSize: 15,
    color: Colors.middleGrey
  },
  usdLabel: {
    fontSize: 11,
    color: Colors.quarterGrey,
    marginLeft: 3
  },
  actionBar: {
    height: 62,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  actionLabel: {
    ...Typography.capitalization.uppercase
  },
  tabs: {
    height: 67,
    justifyContent: 'center'
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 2
  },
  metricsNoMargin: {
    marginTop: 0
  },
  metricContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '20%',
    position: 'relative'
  },
  metric: {
    fontSize: 15,
    color: Colors.white + Colors.alpha50Percent,
    marginBottom: 4
  },
  metricSelected: {
    color: Colors.white,
  },
  metricLabel: {
    ...Typography.fontFamily.sfProDisplayRegular,
    fontSize: 11,
    lineHeight: 11,
    color: Colors.grey130 + Colors.alpha50Percent,
    letterSpacing: 1,
    textAlign: 'center'
  },
  metricLabelSelected: {
    color: Colors.grey130,
  },
  metricUnderline: {
    position: 'absolute',
    backgroundColor: Colors.white,
    height: 2,
    width: 75,
    bottom: 0
  },
  transactionsHeaderContainer: {
    width: '90%',
    marginHorizontal: '5%',
    height: 61,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -16,
    width: '100%'
  },
  transactionsHeaderText: {
    color: Colors.grey130,
    marginTop: 0,
    ...Typography.fontSize.x4
  },
  transactions: {
    marginHorizontal: '5%',
    borderTopColor: Colors.grey44,
    borderTopWidth: 1,
    height: '100%'
  }
});



