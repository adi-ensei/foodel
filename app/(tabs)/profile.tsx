import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";

const profileData = [
  {
    label: "Full Name",
    value: "A Adithyan",
    icon: images.user,
  },
  {
    label: "Email",
    value: "abc@gmail.com",
    icon: images.tomatoes,
  },
  {
    label: "Phone number",
    value: "+1 555 123 4567",
    icon: images.phone,
  },
  {
    label: "Address 1 - (Home)",
    value: "123 Main Street, Springfield, IL 62704",
    icon: images.location,
  },
  {
    label: "Address 2 - (Work)",
    value: "221B Rose Street, Foodville, FL 12345",
    icon: images.location,
  },
];

const ProfileItem = ({ icon, label, value }: any) => (
  <View className="flex-row items-start gap-3 mb-4">
    <Image source={icon} className="w-5 h-5 mt-0.5" resizeMode="contain" />
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="base-bold text-dark-100">{value}</Text>
    </View>
  </View>
);

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={profileData}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => <ProfileItem {...item} />}
        ListHeaderComponent={() => (
          <View className="pb-5 px-5">
            <CustomHeader title="Profile" />
            <View className="items-center mt-6">
              <Image
                source={images.avatar}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
              <TouchableOpacity className="absolute bottom-0 right-[110px] bg-white p-1 rounded-full border border-gray-300">
                <View className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerClassName="px-5 pb-28"
        ListFooterComponent={() => (
          <View className="mt-6 gap-4">
            <TouchableOpacity className="bg-yellow-400 py-3 rounded-xl items-center">
              <Text className="base-bold text-black">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-red-500 py-3 rounded-xl items-center">
              <Text className="base-bold text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
