// import React, { useRef, useState } from 'react';
// import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';

// const CoinTossScreen: React.FC = () => {
//   const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);
//   const [isFlipping, setIsFlipping] = useState(false);
//   const animatedValue = useRef(new Animated.Value(0)).current;

//   const frontInterpolate = animatedValue.interpolate({
//     inputRange: [0, 180],
//     outputRange: ['0deg', '180deg'],
//   });

//   const backInterpolate = animatedValue.interpolate({
//     inputRange: [0, 180],
//     outputRange: ['180deg', '360deg'],
//   });

//   const flipCoin = () => {
//     if (isFlipping) return;
  
//     setIsFlipping(true);
//     const newResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
//     setResult(null);
  
//     // Final rotation value depends on result
//     const endValue = newResult === 'Heads' ? 360 : 540;
  
//     Animated.timing(animatedValue, {
//       toValue: endValue,
//       duration: 1000, 
//       useNativeDriver: true,
//     }).start(() => {
//       setResult(newResult);
//       animatedValue.setValue(endValue % 360); // Reset to base value
//       setIsFlipping(false);
//     });
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🪙 Toss the Coin</Text>

//       <View style={styles.coinContainer}>
//         <Animated.View
//           style={[
//             styles.coin,
//             {
//               transform: [{ rotateY: frontInterpolate }],
//               zIndex: result === 'Heads' ? 1 : 0,
//             },
//           ]}
//         >
//           <Image source={require('../../assets/images/haed.png')} style={styles.image} />
//         </Animated.View>

//         <Animated.View
//           style={[
//             styles.coin,
//             styles.backCoin,
//             {
//               transform: [{ rotateY: backInterpolate }],
//               zIndex: result === 'Tails' ? 1 : 0,
//             },
//           ]}
//         >
//           <Image source={require('../../assets/images/tail.png')} style={styles.image} />
//         </Animated.View>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={flipCoin} disabled={isFlipping}>
//         <Text style={styles.buttonText}>{isFlipping ? 'Flipping...' : 'Flip Coin'}</Text>
//       </TouchableOpacity>

//       {result && !isFlipping && (
//         <Text style={styles.resultText}>🎉 It's {result}!</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     marginBottom: 30,
//   },
//   coinContainer: {
//     width: 200,
//     height: 200,
//     marginBottom: 30,
//   },
//   coin: {
//     width: 200,
//     height: 200,
//     backfaceVisibility: 'hidden',
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backCoin: {
//     transform: [{ rotateY: '180deg' }],
//   },
//   image: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//   },
//   button: {
//     backgroundColor: '#7E8EFF',
//     paddingVertical: 14,
//     paddingHorizontal: 36,
//     borderRadius: 40,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   resultText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0BFDA6',
//   },
// });

// export default CoinTossScreen;

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';

const CoinTossScreen: React.FC = () => {
  const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const moveValue = useRef(new Animated.Value(0)).current;

  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const translateInterpolate = moveValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200], // toss height
  });

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    const newResult = Math.random() < 0.5 ? 'Heads' : 'Tails';

    spinValue.setValue(0);
    moveValue.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(moveValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(moveValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(spinValue, {
        toValue: newResult === 'Heads' ? 720 : 900,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setResult(newResult);
      setIsFlipping(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪙 Toss the Coin</Text>

      <Animated.View
        style={[
          styles.coin,
          {
            transform: [
              { translateY: translateInterpolate },
              { rotateY: rotateInterpolate },
            ],
          },
        ]}
      >
        <Image
          source={
            result === 'Heads'
              ? require('../../assets/images/haed.png')
              : require('../../assets/images/tail.png')
          }
          style={styles.image}
        />
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={flipCoin} disabled={isFlipping}>
        <Text style={styles.buttonText}>{isFlipping ? 'Flipping...' : 'Flip Coin'}</Text>
      </TouchableOpacity>

      {result && !isFlipping && (
        <Text style={styles.resultText}>🎉 It's {result}!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  coin: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  button: {
    backgroundColor: '#7E8EFF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0BFDA6',
  },
});

export default CoinTossScreen;
