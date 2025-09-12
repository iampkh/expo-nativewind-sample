/**
 * Post Chat Screen
 * 
 * Shows forum-style discussions with posts for a specific group ID
 * Retrieves data from collaboration database using repository pattern
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';

// Mock post data structures
interface PostComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: Date;
  likes: number;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: PostComment[];
  tags: string[];
  pinned: boolean;
}

export default function PostChatScreen() {
  const { groupId } = useLocalSearchParams();
  const { currentTheme } = useTheme();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  
  // New post form
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  
  // Comment form
  const [commentText, setCommentText] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState<string | null>(null);
  
  // Mock user data
  const mockUser = { id: 'sample_user', name: 'Sample User' };
  const mockGroupMembers = [
    { id: 'sample_user', name: 'Sample User' },
    { id: 'user_2', name: 'John Doe' },
    { id: 'user_3', name: 'Jane Smith' },
    { id: 'user_4', name: 'Bob Johnson' },
    { id: 'user_5', name: 'Alice Brown' }
  ];

  useEffect(() => {
    loadPostsForGroup();
  }, [groupId]);

  const loadPostsForGroup = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual repository call
      // const postRepository = new PostRepository();
      // const result = await postRepository.getPostsByGroupId(groupId as string);
      
      // Mock data for demonstration
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Welcome to our project discussion!',
          content: 'Hey everyone! This is our dedicated space for discussing project updates, sharing ideas, and collaborating. Feel free to post questions, suggestions, or any other thoughts related to our work.',
          authorId: 'sample_user',
          groupId: groupId as string,
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2023-12-01'),
          likes: 12,
          comments: [
            {
              id: 'c1',
              postId: '1',
              content: 'Great initiative! Looking forward to our discussions.',
              authorId: 'user_2',
              createdAt: new Date('2023-12-01T10:30:00'),
              likes: 3
            },
            {
              id: 'c2',
              postId: '1',
              content: 'Thanks for setting this up! This will be really useful.',
              authorId: 'user_3',
              createdAt: new Date('2023-12-01T14:15:00'),
              likes: 1
            }
          ],
          tags: ['welcome', 'general'],
          pinned: true
        },
        {
          id: '2',
          title: 'Q4 Planning Session - Ideas Needed',
          content: 'We need to start planning for Q4 goals and initiatives. What are some key areas we should focus on? Please share your thoughts and suggestions below.\n\nSome initial ideas:\n- Improve user onboarding\n- Performance optimizations\n- New feature development\n\nWhat else should we consider?',
          authorId: 'user_2',
          groupId: groupId as string,
          createdAt: new Date('2023-12-03'),
          updatedAt: new Date('2023-12-03'),
          likes: 8,
          comments: [
            {
              id: 'c3',
              postId: '2',
              content: 'I think we should also focus on mobile app improvements. We\'ve been getting feedback about responsiveness.',
              authorId: 'user_4',
              createdAt: new Date('2023-12-03T09:20:00'),
              likes: 5
            },
            {
              id: 'c4',
              postId: '2',
              content: 'Analytics and reporting could be another priority. Better insights would help with decision making.',
              authorId: 'user_5',
              createdAt: new Date('2023-12-03T15:45:00'),
              likes: 2
            }
          ],
          tags: ['planning', 'q4', 'strategy'],
          pinned: false
        },
        {
          id: '3',
          title: 'New Design System Components',
          content: 'I\'ve been working on some new components for our design system. Take a look and let me know what you think!\n\n- Updated button styles with better accessibility\n- New card component variations\n- Improved form inputs with validation states\n\nI\'ll share the Figma link once it\'s ready for review.',
          authorId: 'user_3',
          groupId: groupId as string,
          createdAt: new Date('2023-12-05'),
          updatedAt: new Date('2023-12-05'),
          likes: 6,
          comments: [],
          tags: ['design', 'components', 'ui'],
          pinned: false
        }
      ];
      
      setPosts(mockPosts.sort((a, b) => {
        // Pinned posts first, then by date
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('Error', 'Please enter both title and content');
      return;
    }

    try {
      // TODO: Replace with actual repository call
      const newPost: ForumPost = {
        id: Date.now().toString(),
        title: newPostTitle,
        content: newPostContent,
        authorId: mockUser.id,
        groupId: groupId as string,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: [],
        tags: [],
        pinned: false
      };

      setPosts(prev => [newPost, ...prev]);
      
      setNewPostTitle('');
      setNewPostContent('');
      setShowCreatePost(false);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      // TODO: Replace with actual repository call
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      // TODO: Replace with actual repository call
      const newComment: PostComment = {
        id: `c_${Date.now()}`,
        postId: postId,
        content: commentText,
        authorId: mockUser.id,
        createdAt: new Date(),
        likes: 0
      };

      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      );
      
      setPosts(updatedPosts);
      setCommentText('');
      setCommentingOnPost(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const getUserName = (userId: string) => {
    return mockGroupMembers.find(m => m.id === userId)?.name || 'Unknown User';
  };

  const PostCard = ({ post }: { post: ForumPost }) => {
    const isExpanded = expandedPost === post.id;
    const isCommenting = commentingOnPost === post.id;
    
    return (
      <View className={`rounded-lg p-4 mb-4 border ${post.pinned ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        {post.pinned && (
          <View className="flex-row items-center mb-2">
            <Text className="text-blue-600 dark:text-blue-400 text-xs">📌 PINNED</Text>
          </View>
        )}
        
        <Text variant="primary" size="lg" weight="bold" className="mb-2">
          {post.title}
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Text variant="secondary" size="sm">
            👤 {getUserName(post.authorId)} • {post.createdAt.toLocaleDateString()}
          </Text>
        </View>
        
        <Text variant="primary" size="sm" className="mb-3" numberOfLines={isExpanded ? undefined : 3}>
          {post.content}
        </Text>

        {post.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {post.tags.map(tag => (
              <View key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                <Text variant="secondary" size="xs">#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => handleLikePost(post.id)}
              className="flex-row items-center"
            >
              <Text className="mr-1">👍</Text>
              <Text variant="secondary" size="sm">{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setExpandedPost(isExpanded ? null : post.id)}
              className="flex-row items-center"
            >
              <Text className="mr-1">💬</Text>
              <Text variant="secondary" size="sm">{post.comments.length}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => setExpandedPost(isExpanded ? null : post.id)}
          >
            <Text variant="primary" size="sm" className="text-blue-600 dark:text-blue-400">
              {isExpanded ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isExpanded && (
          <>
            {/* Comments Section */}
            {post.comments.length > 0 && (
              <View className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                <Text variant="secondary" size="sm" weight="medium" className="mb-2">
                  Comments ({post.comments.length})
                </Text>
                {post.comments.map(comment => (
                  <View key={comment.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-2">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text variant="secondary" size="xs">
                        {getUserName(comment.authorId)} • {comment.createdAt.toLocaleDateString()}
                      </Text>
                      <TouchableOpacity className="flex-row items-center">
                        <Text className="mr-1">👍</Text>
                        <Text variant="secondary" size="xs">{comment.likes}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text variant="primary" size="sm">{comment.content}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Add Comment */}
            <View className="border-t border-gray-200 dark:border-gray-700 pt-3">
              {!isCommenting ? (
                <TouchableOpacity
                  onPress={() => setCommentingOnPost(post.id)}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
                >
                  <Text variant="secondary" size="sm">💬 Add a comment...</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Write your comment..."
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                    autoFocus
                  />
                  <View className="flex-row gap-2">
                    <Button
                      title="Comment"
                      onPress={() => handleAddComment(post.id)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    />
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setCommentingOnPost(null);
                        setCommentText('');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    />
                  </View>
                </View>
              )}
            </View>
          </>
        )}
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
              📝 Post Chat
            </Text>
            <Text variant="secondary" size="sm">
              Group ID: {groupId}
            </Text>
          </View>
          
          <View className="flex-row gap-2">
            <Button
              title="+ New Post"
              onPress={() => setShowCreatePost(true)}
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
            <Text variant="secondary">Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View className="items-center py-20">
            <Text size="4xl" className="mb-4">📝</Text>
            <Text variant="primary" size="lg" weight="semibold" className="mb-2">
              No posts yet
            </Text>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              Start a discussion by creating your first post
            </Text>
            <Button
              title="Create First Post"
              onPress={() => setShowCreatePost(true)}
              variant="primary"
            />
          </View>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </ScrollView>

      {/* Create Post Modal */}
      {showCreatePost && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-[80%]">
            <ScrollView>
              <Text variant="primary" size="lg" weight="bold" className="mb-4">
                Create New Post
              </Text>
              
              <Text variant="secondary" size="sm" className="mb-2">Title:</Text>
              <TextInput
                value={newPostTitle}
                onChangeText={setNewPostTitle}
                placeholder="What's your post about?"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              
              <Text variant="secondary" size="sm" className="mb-2">Content:</Text>
              <TextInput
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="Share your thoughts, ideas, or questions..."
                multiline
                numberOfLines={6}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                style={{ textAlignVertical: 'top' }}
              />
              
              <View className="flex-row gap-2">
                <Button
                  title="Create Post"
                  onPress={handleCreatePost}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowCreatePost(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}