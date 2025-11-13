import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  type: 'text' | 'file' | 'voice';
  fileName?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
}

interface Group {
  id: number;
  name: string;
  avatar: string;
  members: number[];
  adminId: number;
  lastMessage: string;
  time: string;
}

interface Invitation {
  id: number;
  groupId: number;
  groupName: string;
  fromAdmin: string;
  timestamp: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'groups' | 'settings'>('chats');
  const [isAdmin] = useState(true);
  const [currentUserId] = useState(1);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<number | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 1, groupId: 3, groupName: 'Маркетинг команда', fromAdmin: 'Иван Петров', timestamp: 'Сейчас' },
  ]);
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'Команда разработки', avatar: '', members: [1, 2, 3], adminId: 1, lastMessage: 'Готов к созвону в 15:00', time: '13:22' },
    { id: 2, name: 'Дизайн обсуждение', avatar: '', members: [1, 4], adminId: 1, lastMessage: 'Посмотри новые макеты', time: 'Вчера' },
    { id: 3, name: 'Маркетинг команда', avatar: '', members: [2, 3, 4], adminId: 2, lastMessage: 'Новая кампания запущена', time: 'Вчера' },
  ]);
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', timestamp: '14:30', type: 'text' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', sender: 'me', timestamp: '14:32', type: 'text', status: 'read' },
    { id: 3, text: 'Звучит интересно, расскажи подробнее', sender: 'other', timestamp: '14:33', type: 'text' },
    { id: 4, text: 'Документация.pdf', sender: 'me', timestamp: '14:35', type: 'file', fileName: 'Документация.pdf', status: 'delivered' },
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Документация.pdf', time: '14:35', unread: 0, online: true },
    { id: 2, name: 'Команда разработки', avatar: '', lastMessage: 'Готов к созвону в 15:00', time: '13:22', unread: 3, online: false },
    { id: 3, name: 'Михаил Петров', avatar: '', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false },
    { id: 4, name: 'Дизайн обсуждение', avatar: '', lastMessage: 'Посмотри новые макеты', time: 'Вчера', unread: 1, online: false },
  ];

  const contacts: Contact[] = [
    { id: 1, name: 'Анна Смирнова', avatar: '', status: 'В сети', online: true },
    { id: 2, name: 'Михаил Петров', avatar: '', status: 'Был 2 часа назад', online: false },
    { id: 3, name: 'Елена Козлова', avatar: '', status: 'В сети', online: true },
    { id: 4, name: 'Дмитрий Иванов', avatar: '', status: 'Был вчера', online: false },
  ];

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return;
    
    const newGroup: Group = {
      id: groups.length + 1,
      name: newGroupName,
      avatar: '',
      members: [currentUserId, ...selectedMembers],
      adminId: currentUserId,
      lastMessage: 'Группа создана',
      time: 'Сейчас'
    };
    
    selectedMembers.forEach(memberId => {
      const newInvitation: Invitation = {
        id: invitations.length + 1 + memberId,
        groupId: newGroup.id,
        groupName: newGroup.name,
        fromAdmin: 'Вы',
        timestamp: 'Сейчас'
      };
    });
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setSelectedMembers([]);
    setShowCreateGroup(false);
  };

  const handleSendInvitation = (groupId: number, contactId: number) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || group.adminId !== currentUserId) return;
    
    const newInvitation: Invitation = {
      id: invitations.length + 1,
      groupId: group.id,
      groupName: group.name,
      fromAdmin: 'Администратор',
      timestamp: 'Сейчас'
    };
    
    setInvitations([...invitations, newInvitation]);
  };

  const handleAcceptInvitation = (invitationId: number) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;
    
    setGroups(groups.map(group => 
      group.id === invitation.groupId
        ? { ...group, members: [...group.members, currentUserId] }
        : group
    ));
    
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
  };

  const handleDeclineInvitation = (invitationId: number) => {
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
  };

  const handleRemoveMember = (groupId: number, memberId: number) => {
    setGroups(groups.map(group => 
      group.id === groupId && group.adminId === currentUserId
        ? { ...group, members: group.members.filter(m => m !== memberId) }
        : group
    ));
  };

  const handleInviteToGroup = (groupId: number) => {
    setSelectedGroupForInvite(groupId);
    setShowInviteDialog(true);
  };

  const handleSendSelectedInvitations = () => {
    if (!selectedGroupForInvite) return;
    
    const group = groups.find(g => g.id === selectedGroupForInvite);
    if (!group) return;
    
    selectedMembers.forEach(memberId => {
      if (!group.members.includes(memberId)) {
        handleSendInvitation(selectedGroupForInvite, memberId);
      }
    });
    
    setSelectedMembers([]);
    setShowInviteDialog(false);
    setSelectedGroupForInvite(null);
  };

  const toggleMemberSelection = (contactId: number) => {
    setSelectedMembers(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const newMessage: Message = {
          id: messages.length + 1,
          text: file.name,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          type: 'file',
          fileName: file.name,
          status: 'sent'
        };
        setMessages([...messages, newMessage]);

        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ));
        }, 1000);

        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          ));
        }, 2000);
      }
    };
    input.click();
  };

  const handleVoiceMessage = () => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: 'Голосовое сообщение',
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: 'voice',
      status: 'sent'
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const renderChatList = () => (
    <div className="space-y-1">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setSelectedChat(chat.id)}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary ${
            selectedChat === chat.id ? 'bg-secondary' : ''
          }`}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={chat.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {chat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium text-sm truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
          </div>
          {chat.unread > 0 && (
            <Badge className="bg-primary text-primary-foreground">{chat.unread}</Badge>
          )}
        </div>
      ))}
    </div>
  );

  const renderContactList = () => (
    <div className="space-y-1">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary"
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {contact.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm mb-1">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">{contact.status}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div
            className={`max-w-[70%] rounded-2xl p-3 ${
              message.sender === 'me'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border'
            }`}
          >
            {message.type === 'text' && <p className="text-sm">{message.text}</p>}
            {message.type === 'file' && (
              <div className="flex items-center gap-2">
                <Icon name="File" size={20} />
                <span className="text-sm">{message.fileName}</span>
              </div>
            )}
            {message.type === 'voice' && (
              <div className="flex items-center gap-2">
                <Icon name="Mic" size={20} />
                <div className="flex-1 h-1 bg-current opacity-30 rounded-full" />
                <span className="text-xs">0:15</span>
              </div>
            )}
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              message.sender === 'me' ? 'opacity-70 justify-end' : 'text-muted-foreground'
            }`}>
              <span>{message.timestamp}</span>
              {message.sender === 'me' && message.status && (
                <span className="flex items-center">
                  {message.status === 'sent' && <Icon name="Check" size={14} />}
                  {message.status === 'delivered' && (
                    <span className="flex">
                      <Icon name="Check" size={14} className="-mr-2" />
                      <Icon name="Check" size={14} />
                    </span>
                  )}
                  {message.status === 'read' && (
                    <span className="flex text-primary">
                      <Icon name="Check" size={14} className="-mr-2" />
                      <Icon name="Check" size={14} />
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatView = () => {
    if (!selectedChat) {
      return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-20" />
            <p>Выберите чат для начала общения</p>
          </div>
        </div>
      );
    }

    const chat = chats.find(c => c.id === selectedChat);

    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={chat?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {chat?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{chat?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {chat?.online ? 'В сети' : 'Был недавно'}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Video" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {renderMessages()}
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleFileUpload}>
              <Icon name="Paperclip" size={20} />
            </Button>
            <Input
              placeholder="Написать сообщение..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={handleVoiceMessage}>
              <Icon name="Mic" size={20} />
            </Button>
            <Button size="icon" onClick={handleSendMessage}>
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return renderChatList();
      case 'contacts':
        return renderContactList();
      case 'groups':
        return (
          <div className="space-y-2">
            {invitations.length > 0 && (
              <div className="px-2 mb-3">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Приглашения</h3>
                {invitations.map(invitation => (
                  <Card key={invitation.id} className="p-3 mb-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Icon name="Users" size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{invitation.groupName}</p>
                        <p className="text-xs text-muted-foreground">От: {invitation.fromAdmin}</p>
                        <p className="text-xs text-muted-foreground">{invitation.timestamp}</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptInvitation(invitation.id)}
                            className="flex-1"
                          >
                            Принять
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineInvitation(invitation.id)}
                            className="flex-1"
                          >
                            Отклонить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {isAdmin && (
              <div className="px-2">
                {!showCreateGroup ? (
                  <Button 
                    className="w-full"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать группу
                  </Button>
                ) : (
                  <Card className="p-3 space-y-3">
                    <Input 
                      placeholder="Название группы"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      <p className="text-xs text-muted-foreground mb-2">Выберите участников:</p>
                      {contacts.map(contact => (
                        <div
                          key={contact.id}
                          onClick={() => toggleMemberSelection(contact.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedMembers.includes(contact.id) ? 'bg-primary/20' : 'hover:bg-secondary'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedMembers.includes(contact.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                          }`}>
                            {selectedMembers.includes(contact.id) && (
                              <Icon name="Check" size={12} className="text-white" />
                            )}
                          </div>
                          <span className="text-sm">{contact.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setShowCreateGroup(false);
                          setNewGroupName('');
                          setSelectedMembers([]);
                        }}
                      >
                        Отмена
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={handleCreateGroup}
                      >
                        Создать
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {showInviteDialog && (
              <div className="px-2 mb-3">
                <Card className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Пригласить в группу</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowInviteDialog(false);
                        setSelectedMembers([]);
                        setSelectedGroupForInvite(null);
                      }}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {contacts.filter(contact => {
                      const group = groups.find(g => g.id === selectedGroupForInvite);
                      return group && !group.members.includes(contact.id);
                    }).map(contact => (
                      <div
                        key={contact.id}
                        onClick={() => toggleMemberSelection(contact.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedMembers.includes(contact.id) ? 'bg-primary/20' : 'hover:bg-secondary'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedMembers.includes(contact.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedMembers.includes(contact.id) && (
                            <Icon name="Check" size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm">{contact.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleSendSelectedInvitations}
                    disabled={selectedMembers.length === 0}
                  >
                    Отправить приглашения
                  </Button>
                </Card>
              </div>
            )}
            
            {groups.filter(g => g.members.includes(currentUserId)).map((group) => (
              <div
                key={group.id}
                className="p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Icon name="Users" size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-sm truncate">{group.name}</h3>
                      <span className="text-xs text-muted-foreground ml-2">{group.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {group.members.length} участников
                    </p>
                  </div>
                </div>
                
                {group.adminId === currentUserId && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">Участники группы:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInviteToGroup(group.id)}
                        className="h-7 text-xs"
                      >
                        <Icon name="UserPlus" size={14} className="mr-1" />
                        Пригласить
                      </Button>
                    </div>
                    {group.members.map(memberId => {
                      const member = contacts.find(c => c.id === memberId);
                      const isCurrentUser = memberId === currentUserId;
                      return member || isCurrentUser ? (
                        <div key={memberId} className="flex items-center justify-between p-2 rounded hover:bg-secondary/50">
                          <span className="text-sm">
                            {isCurrentUser ? 'Вы (Админ)' : member?.name}
                          </span>
                          {!isCurrentUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(group.id, memberId)}
                              className="h-7 px-2"
                            >
                              <Icon name="X" size={14} />
                            </Button>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                {group.adminId !== currentUserId && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Участников: {group.members.length}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">Я</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Мой профиль</h3>
                <p className="text-sm text-muted-foreground">В сети</p>
              </div>
            </div>
            
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors">
                <Icon name="Bell" size={20} />
                <span>Уведомления</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors">
                <Icon name="Lock" size={20} />
                <span>Приватность</span>
              </div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div className="flex items-center gap-3">
                  <Icon name="Palette" size={20} />
                  <span>Темная тема</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-muted'
                } relative cursor-pointer`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </div>
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors">
                <Icon name="HelpCircle" size={20} />
                <span>Помощь</span>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r flex flex-col bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Мессенджер</h1>
              <Button variant="ghost" size="icon">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </div>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск..." className="pl-9" />
            </div>
          </div>

          <div className="flex border-b bg-background">
            {[
              { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
              { id: 'contacts', icon: 'Users', label: 'Контакты' },
              { id: 'groups', icon: 'Users', label: 'Группы' },
              { id: 'settings', icon: 'Settings', label: 'Настройки' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon as any} size={16} className="mx-auto mb-1" />
                <div className="hidden lg:block">{tab.label}</div>
              </button>
            ))}
          </div>

          <ScrollArea className="flex-1 p-2">
            {renderContent()}
          </ScrollArea>
        </div>

        {renderChatView()}
      </div>
    </div>
  );
};

export default Index;