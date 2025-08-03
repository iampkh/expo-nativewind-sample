import { Link, Stack } from 'expo-router';
import { Text, View } from '@/src/components/themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center" padding="lg">
        <Text variant="primary" size="3xl" weight="bold" className="mb-4">
          This screen does not exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text variant="accent" size="base" weight="medium">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

