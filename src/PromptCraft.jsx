import React, { useState, useEffect } from 'react';
import { Heart, Search, Plus } from 'lucide-react';

export default function PromptCraft() {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState(null);
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    category: 'Программирование',
    content: ''
  });

  const categories = [
    'All',
    'Программирование',
    'Маркетинг',
    'Творчество',
    'Бизнес',
    'Образование',
    'Дизайн',
    'Продажи',
    'Писательство',
    'Разное'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('prompts');
    if (saved) {
      setPrompts(JSON.parse(saved));
    } else {
      const defaultPrompts = [
        {
          id: 1,
          title: 'Отличный Python класс',
          description: 'Промпт для генерации качественного Python кода',
          category: 'Программирование',
          content: 'Напиши класс на Python который...',
          author: 'CodeMaster',
          likes: 234,
          liked: false
        },
        {
          id: 2,
          title: 'Маркетинг постов для Instagram',
          description: 'Создавай вирусные посты за минуту',
          category: 'Маркетинг',
          content: 'Напиши 5 постов для Instagram о...',
          author: 'SocialGuru',
          likes: 567,
          liked: false
        },
        {
          id: 3,
          title: 'Истории с разветвлениями',
          description: 'Генерируй интерактивные истории',
          category: 'Творчество',
          content: 'Создай историю с 5 разными концовками...',
          author: 'StoryWriter',
          likes: 891,
          liked: false
        },
        {
          id: 4,
          title: 'Бизнес план за 5 минут',
          description: 'Быстрый шаблон для стартапа',
          category: 'Бизнес',
          content: 'Создай детальный бизнес план...',
          author: 'EntrepreneurPro',
          likes: 445,
          liked: false
        }
      ];
      setPrompts(defaultPrompts);
      localStorage.setItem('prompts', JSON.stringify(defaultPrompts));
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    let filtered = prompts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => b.likes - a.likes);
    setFilteredPrompts(filtered);
  }, [prompts, selectedCategory, searchTerm]);

  const handleLogin = () => {
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Amer',
      email: 'amertklop@gmail.com',
      avatar: '👤'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleLike = (id) => {
    const updated = prompts.map(p => {
      if (p.id === id) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPrompts(updated);
    localStorage.setItem('prompts', JSON.stringify(updated));
  };

  const handleAddPrompt = () => {
    if (!newPrompt.title || !newPrompt.content) {
      alert('Заполните все поля!');
      return;
    }

    const prompt = {
      id: Math.max(...prompts.map(p => p.id), 0) + 1,
      ...newPrompt,
      author: user?.name || 'Anonymous',
      likes: 0,
      liked: false
    };

    const updated = [...prompts, prompt];
    setPrompts(updated);
    localStorage.setItem('prompts', JSON.stringify(updated));
    setNewPrompt({ title: '', description: '', category: 'Программирование', content: '' });
    setShowNewPromptModal(false);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('✅ Промпт скопирован!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ PromptCraft
          </div>

          <div className="flex-1 mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск промптов..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowNewPromptModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg text-white font-semibold transition"
                >
                  <Plus className="w-5 h-5" /> Добавить
                </button>
                <div className="flex items-center gap-2 text-gray-300">
                  <span>👤</span>
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400"
                >
                  🚪
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg text-white font-semibold transition"
              >
                Вход
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Маркетплейс промптов для ИИ
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Создавай, делись и находи лучшие промпты
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogin}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            🚀 Начать сейчас
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-12 grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-purple-400">{prompts.length}+</div>
          <div className="text-gray-300">Промптов</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-pink-400">{prompts.reduce((sum, p) => sum + p.likes, 0)}+</div>
          <div className="text-gray-300">Лайков</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-blue-400">{categories.length - 1}</div>
          <div className="text-gray-300">Категорий</div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Промптов не найдено 🔍</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full">
                    {prompt.category}
                  </span>
                  <button
                    onClick={() => handleLike(prompt.id)}
                    className={`transition ${prompt.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className="w-5 h-5" fill={prompt.liked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {prompt.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4">
                  {prompt.description}
                </p>

                <div className="bg-black/30 rounded p-3 mb-4 border border-purple-500/10 text-xs text-gray-300 line-clamp-3">
                  {prompt.content}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    <span className="text-red-400 font-semibold">{prompt.likes}</span> лайков
                  </div>
                  <button
                    onClick={() => handleCopy(prompt.content)}
                    className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 rounded text-xs font-semibold transition"
                  >
                    Копировать
                  </button>
                </div>

                <div className="text-xs text-gray-500 pt-3 border-t border-gray-700/50">
                  {prompt.author}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showNewPromptModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Добавить промпт</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Название"
                className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
              />

              <input
                type="text"
                placeholder="Описание"
                className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={newPrompt.description}
                onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
              />

              <select
                className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500"
                value={newPrompt.category}
                onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <textarea
                placeholder="Текст промпта..."
                rows="4"
                className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={newPrompt.content}
                onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewPromptModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-purple-500/20 text-white rounded hover:bg-gray-800 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleAddPrompt}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
