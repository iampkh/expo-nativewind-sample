import { Stack } from 'expo-router';

export default function AppLayout() {
  // Remove auth protection for demo purposes
  // Authentication can be re-enabled by uncommenting the following:
  // const { isAuthenticated } = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace('/login');
  //   }
  // }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}