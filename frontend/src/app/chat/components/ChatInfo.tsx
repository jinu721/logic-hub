import React from "react";
import ChatInfoPanel from "./ChatInfoPanel";
import RecentMedia from "./RecentMedia";
import GroupAdminActions from "./GroupAdminActions";
import ChatSettings from "./ChatSettings";
import MembersList from "./MembersList";
import AddMembers from "./AddMembers";

import { ConversationIF } from "@/types/conversation.types";
import { GroupIF } from "@/types/group.types";
import { UserIF } from "@/types/user.types";
import { MessageIF } from "@/types/message.types";

interface ChatInfoProps {
  isGroupChat: boolean;
  isBlocked: boolean;
  userRole: "member" | "admin" | "owner";
  otherUser: UserIF | null;
  currentConversationData: ConversationIF;
  messages: MessageIF[];
  showEditGroup: boolean;
  setShowEditGroup: React.Dispatch<React.SetStateAction<boolean>>;
  groupUpdateData: Partial<GroupIF>;
  setGroupUpdateData:  React.Dispatch<React.SetStateAction<Partial<GroupIF>>>;
  handleImageUploadGroup: (file: File) => void;
  handleSaveChanges: () => void;
  showJoinRequests: boolean;
  setShowJoinRequests: (value: boolean) => void;
  handleRequestAprrove: (userId: string) => void;
  handleMemberAction: (action: string, userId: string) => void;
  handleDeleteGroup: () => void;
  handleLeaveGroup: () => void;
  handleDeleteChat: () => void;
  setReportPopupOpen: (value: boolean) => void;
  setShowUserInfo: (value: boolean) => void;
  showAllMembers: boolean;
  setShowAllMembers: (value: boolean) => void;
  openMenuId: string | null;
  toggleMenu: (id: string) => void;
  handleMakeAdmin: (userId: string) => void;
  handleRemoveAdmin: (userId: string) => void;
  handleRemoveMember: (userId: string) => void;
  canManageMember: (user: UserIF) => boolean;
  showAddMembers: boolean;
  setShowAddMembers: (value: boolean) => void;
  availableMembers: UserIF[];
  selectedUsersAdd: UserIF[];
  handleRemoveUser: (userId: string) => void;
  handleAddUser: (user: UserIF) => void;
  handleAddSelectedMembers: () => void;
}

const ChatInfo: React.FC<ChatInfoProps> = ({
  isGroupChat,
  isBlocked,
  userRole,
  otherUser,
  currentConversationData,
  messages,
  showEditGroup,
  setShowEditGroup,
  groupUpdateData,
  setGroupUpdateData,
  handleImageUploadGroup,
  handleSaveChanges,
  showJoinRequests,
  setShowJoinRequests,
  handleRequestAprrove,
  handleMemberAction,
  handleDeleteGroup,
  handleLeaveGroup,
  handleDeleteChat,
  setReportPopupOpen,
  setShowUserInfo,
  showAllMembers,
  setShowAllMembers,
  openMenuId,
  toggleMenu,
  handleMakeAdmin,
  handleRemoveAdmin,
  handleRemoveMember,
  canManageMember,
  showAddMembers,
  setShowAddMembers,
  availableMembers,
  selectedUsersAdd,
  handleRemoveUser,
  handleAddUser,
  handleAddSelectedMembers,
}) => {
  if(!currentConversationData) return null
  return (
    <>
      <ChatInfoPanel
        isGroupChat={isGroupChat}
        currentConversationData={currentConversationData}
        otherUser={otherUser}
        setShowUserInfo={setShowUserInfo}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {isGroupChat && (
          <>
            <RecentMedia messages={messages} />

            <GroupAdminActions
              userRole={userRole}
              showEditGroup={showEditGroup}
              setShowEditGroup={setShowEditGroup}
              groupUpdateData={groupUpdateData}
              setGroupUpdateData={setGroupUpdateData}
              currentConversationData={currentConversationData}
              handleImageUploadGroup={handleImageUploadGroup as any}
              handleSaveChanges={handleSaveChanges}
              showJoinRequests={showJoinRequests}
              setShowJoinRequests={setShowJoinRequests as any}
              handleRequestAprrove={handleRequestAprrove}
            />

            <ChatSettings
              isGroupChat={isGroupChat}
              isBlocked={isBlocked}
              userRole={userRole}
              otherUser={otherUser}
              handleMemberAction={handleMemberAction}
              handleDeleteGroup={handleDeleteGroup}
              handleLeaveGroup={handleLeaveGroup}
              handleDeleteChat={handleDeleteChat}
              setReportPopupOpen={setReportPopupOpen}
            />

            <MembersList
              currentConversationData={currentConversationData}
              userRole={userRole}
              showAllMembers={showAllMembers}
              setShowAllMembers={setShowAllMembers}
              toggleMenu={toggleMenu}
              openMenuId={openMenuId}
              handleMakeAdmin={handleMakeAdmin}
              handleRemoveAdmin={handleRemoveAdmin}
              handleRemoveMember={handleRemoveMember}
              canManageMember={canManageMember}
              setShowAddMembers={setShowAddMembers}
            />

            {showAddMembers && (
              <AddMembers
                currentConversationData={currentConversationData}
                availableMembers={availableMembers as any}
                selectedUsersAdd={selectedUsersAdd}
                handleRemoveUser={handleRemoveUser}
                handleAddUser={handleAddUser}
                handleAddSelectedMembers={handleAddSelectedMembers}
                setShowAddMembers={setShowAddMembers}
                searchText={""}
                setSearchText={(value:string) => {
                  console.log(value);
                }}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ChatInfo;
