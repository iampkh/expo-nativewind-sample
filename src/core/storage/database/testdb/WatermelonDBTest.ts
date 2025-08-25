import TestUser from './models/TestUser'

export async function testWatermelonDB() {
  const { database } = await import('../../database');
  try {
    console.log('🔍 [WatermelonDB] Starting database test...')
    
    // Clear existing data for clean test
    await database.write(async () => {
      const allUsers = await database.get<TestUser>('test_users').query().fetch()
      console.log(`🧹 [WatermelonDB] Clearing ${allUsers.length} existing records`)
      
      const batches = allUsers.map(user => user.prepareDestroyPermanently())
      if (batches.length > 0) {
        await database.batch(...batches)
      }
    })
    
    // Test data to insert
    const testUsers = [
      { name: 'Alice Johnson', email: 'alice@test.com', age: 28 },
      { name: 'Bob Smith', email: 'bob@test.com', age: 34 },
      { name: 'Charlie Brown', email: 'charlie@test.com', age: 22 }
    ]
    
    console.log('✍️ [WatermelonDB] Inserting test users...')
    
    // Insert test data
    await database.write(async () => {
      const userCollection = database.get<TestUser>('test_users')
      
      for (const userData of testUsers) {
        await userCollection.create(user => {
          user.name = userData.name
          user.email = userData.email
          user.age = userData.age
        })
      }
    })
    
    console.log('✅ [WatermelonDB] Test data inserted successfully')
    
    // Query and display all users
    console.log('📖 [WatermelonDB] Querying database...')
    const allUsers = await database.get<TestUser>('test_users').query().fetch()
    
    console.log(`📊 [WatermelonDB] Found ${allUsers.length} users in database:`)
    
    allUsers.forEach((user, index) => {
      console.log(`👤 [WatermelonDB] User ${index + 1}:`, {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age
      })
    })
    
    // Test a query with conditions
    const youngUsers = await database.get<TestUser>('test_users')
      .query()
      .fetch()
    
    // Filter manually to demonstrate database functionality
    const filteredYoungUsers = youngUsers.filter(user => user.age < 25)
    
    console.log(`🔍 [WatermelonDB] Users under 25: ${filteredYoungUsers.length}`)
    filteredYoungUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.age} years old)`)
    })
    
    console.log('🎉 [WatermelonDB] Database test completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ [WatermelonDB] Test failed:', error)
    if (error instanceof Error) {
      console.error('❌ [WatermelonDB] Error message:', error.message)
      console.error('❌ [WatermelonDB] Stack trace:', error.stack)
    }
    return false
  }
}