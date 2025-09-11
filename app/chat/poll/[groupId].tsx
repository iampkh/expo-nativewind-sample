/**
 * Poll Chat Screen
 * 
 * Shows poll discussions for a specific group ID
 * Retrieves data from collaboration database using repository pattern
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/src/store';

// Mock poll data structure - this would come from database
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  groupId: string;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export default function PollChatScreen() {
  const { groupId } = useLocalSearchParams();
  const { currentTheme } = useTheme();
  const [polls, setPolls] = useState<PollData[]>([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  // Mock user data
  const mockUser = { id: 'sample_user', name: 'Sample User' };

  useEffect(() => {
    loadPollsForGroup();
  }, [groupId]);

  const loadPollsForGroup = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual repository call
      // const pollRepository = new PollRepository();
      // const result = await pollRepository.getPollsByGroupId(groupId as string);
      
      // Mock data for demonstration
      const mockPolls: PollData[] = [
        {
          id: '1',
          question: 'What should we have for the team lunch?',
          options: [
            { id: '1', text: 'Pizza', votes: 5 },
            { id: '2', text: 'Sushi', votes: 3 },
            { id: '3', text: 'Burgers', votes: 7 }
          ],
          groupId: groupId as string,
          createdBy: 'user_1',
          createdAt: new Date('2023-12-01'),
          isActive: true
        },
        {
          id: '2',
          question: 'Which feature should we prioritize next?',
          options: [
            { id: '4', text: 'Dark mode', votes: 12 },
            { id: '5', text: 'Push notifications', votes: 8 },
            { id: '6', text: 'Chat improvements', votes: 15 }
          ],
          groupId: groupId as string,
          createdBy: 'user_2',
          createdAt: new Date('2023-12-05'),
          isActive: true
        }
      ];
      
      setPolls(mockPolls);
    } catch (error) {
      Alert.alert('Error', 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      // TODO: Replace with actual repository call
      // const pollRepository = new PollRepository();
      // await pollRepository.voteOnPoll(pollId, optionId, mockUser.id);
      
      // Update local state for demo
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll.id === pollId 
            ? {
                ...poll,
                options: poll.options.map(option =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                )
              }
            : poll
        )
      );

      Alert.alert('Success', 'Vote recorded!');
    } catch (error) {
      Alert.alert('Error', 'Failed to record vote');
    }
  };

  const handleCreatePoll = async () => {
    if (!newPollQuestion.trim() || newPollOptions.some(opt => !opt.trim())) {
      Alert.alert('Error', 'Please fill in the question and all options');
      return;
    }

    try {
      // TODO: Replace with actual repository call
      // const pollRepository = new PollRepository();
      // const result = await pollRepository.createPoll({
      //   question: newPollQuestion,
      //   options: newPollOptions.filter(opt => opt.trim()),
      //   groupId: groupId as string,
      //   createdBy: mockUser.id
      // });

      // Mock creating a new poll
      const newPoll: PollData = {
        id: Date.now().toString(),
        question: newPollQuestion,
        options: newPollOptions.map((opt, idx) => ({
          id: `opt_${Date.now()}_${idx}`,
          text: opt.trim(),
          votes: 0
        })),
        groupId: groupId as string,
        createdBy: mockUser.id,
        createdAt: new Date(),
        isActive: true
      };

      setPolls(prev => [newPoll, ...prev]);
      setNewPollQuestion('');
      setNewPollOptions(['', '']);
      setShowCreatePoll(false);
      Alert.alert('Success', 'Poll created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create poll');
    }
  };

  const addPollOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const updatePollOption = (index: number, text: string) => {
    const updated = [...newPollOptions];
    updated[index] = text;
    setNewPollOptions(updated);
  };

  const removePollOption = (index: number) => {
    if (newPollOptions.length > 2) {
      const updated = newPollOptions.filter((_, idx) => idx !== index);
      setNewPollOptions(updated);
    }
  };

  const PollCard = ({ poll }: { poll: PollData }) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    
    return (
      <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <Text variant="primary" size="lg" weight="semibold" className="mb-2">
          {poll.question}
        </Text>
        <Text variant="secondary" size="xs" className="mb-3">
          Created {poll.createdAt.toLocaleDateString()} • {totalVotes} votes
        </Text>
        
        <View className="gap-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleVote(poll.id, option.id)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 relative overflow-hidden"
              >
                {/* Progress bar background */}
                <View 
                  className="absolute left-0 top-0 bottom-0 bg-blue-100 dark:bg-blue-900"
                  style={{ width: `${percentage}%` }}
                />
                
                <View className="flex-row justify-between items-center relative z-10">
                  <Text variant="primary" size="sm" className="flex-1">
                    {option.text}
                  </Text>
                  <Text variant="secondary" size="sm">
                    {option.votes} ({percentage}%)
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text variant="brand" size="2xl" weight="bold">
              📊 Poll Chat
            </Text>
            <Text variant="secondary" size="sm">
              Group ID: {groupId}
            </Text>
          </View>
          
          <View className="flex-row gap-2">
            <Button
              title="+ New Poll"
              onPress={() => setShowCreatePoll(true)}
              variant="primary"
              size="sm"
            />
            <Button
              title="← Back"
              onPress={() => router.back()}
              variant="outline"
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="secondary">Loading polls...</Text>
          </View>
        ) : polls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text size="4xl" className="mb-4">📊</Text>
            <Text variant="primary" size="lg" weight="semibold" className="mb-2">
              No polls yet
            </Text>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              Create your first poll to start gathering opinions from the group
            </Text>
            <Button
              title="Create First Poll"
              onPress={() => setShowCreatePoll(true)}
              variant="primary"
            />
          </View>
        ) : (
          polls.map(poll => <PollCard key={poll.id} poll={poll} />)
        )}
      </ScrollView>

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <Text variant="primary" size="lg" weight="bold" className="mb-4">
              Create New Poll
            </Text>
            
            <Text variant="secondary" size="sm" className="mb-2">Question:</Text>
            <TextInput
              value={newPollQuestion}
              onChangeText={setNewPollQuestion}
              placeholder="What would you like to ask?"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              multiline
            />
            
            <Text variant="secondary" size="sm" className="mb-2">Options:</Text>
            {newPollOptions.map((option, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <TextInput
                  value={option}
                  onChangeText={(text) => updatePollOption(index, text)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mr-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />
                {newPollOptions.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removePollOption(index)}
                    className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded items-center justify-center"
                  >
                    <Text className="text-red-600 dark:text-red-400">×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity
              onPress={addPollOption}
              className="border border-dashed border-gray-400 rounded-lg p-2 items-center mb-4"
            >
              <Text variant="secondary" size="sm">+ Add Option</Text>
            </TouchableOpacity>
            
            <View className="flex-row gap-2">
              <Button
                title="Create Poll"
                onPress={handleCreatePoll}
                variant="primary"
                size="sm"
                className="flex-1"
              />
              <Button
                title="Cancel"
                onPress={() => setShowCreatePoll(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}