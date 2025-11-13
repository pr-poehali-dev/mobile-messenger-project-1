import { useState } from 'react';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'groups' | 'status' | 'settings'>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', timestamp: '14:30', type: 'text' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', sender: 'me', timestamp: '14:32', type: 'text' },
    { id: 3, text: 'Звучит интересно, расскажи подробнее', sender: 'other', timestamp: '14:33', type: 'text' },
    { id: 4, text: 'Документация.pdf', sender: 'me', timestamp: '14:35', type: 'file', fileName: 'Документация.pdf' },
  ]);

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

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
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
          fileName: file.name
        };
        setMessages([...messages, newMessage]);
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
      type: 'voice'
    };
    setMessages([...messages, newMessage]);
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
            <span className={`text-xs mt-1 block ${
              message.sender === 'me' ? 'opacity-70' : 'text-muted-foreground'
            }`}>
              {message.timestamp}
            </span>
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
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-20" />
            <p>Групповые чаты</p>
          </div>
        );
      case 'status':
        return (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Circle" size={64} className="mx-auto mb-4 opacity-20" />
            <p>Статусы</p>
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
              <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors">
                <Icon name="Palette" size={20} />
                <span>Тема оформления</span>
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
              { id: 'status', icon: 'Circle', label: 'Статусы' },
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
