import React, { useState, useEffect } from 'react';

// --- ИКОНКИ ---
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSupport = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9a7 7 0 0 0-7-7z" />
  </svg>
);

const IconGroup = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconMessage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconLogOut = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function StudentMiniApp() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weekType, setWeekType] = useState('current');
  const [errorMsg, setErrorMsg] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '' });
  const [studentData, setStudentData] = useState(null);
  const [schedule, setSchedule] = useState({ current: [], next: [] });

  // --- Парсер даты из "10-Nov-25" ИЛИ "12/20/2025" ---
const parseDate = (dateStr) => {
  if (!dateStr) return new Date();

  // Формат "10-Nov-25"
  if (dateStr.includes('-')) {
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]];
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
  }

  // Формат "12/20/2025" (MM/DD/YYYY)
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }

  return new Date();
};


  // --- Группировка пар по дням ---
  const groupEventsByDay = (events) => {
    const groups = {};
    events.forEach((event) => {
      const dateKey = event.dateObj.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateObj: event.dateObj,
          dayLabel: event.day.toUpperCase().substring(0, 2),
          fullDate: event.dateObj.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
          }),
          items: [],
        };
      }
      groups[dateKey].items.push(event);
    });

    const sortedGroups = Object.values(groups).sort(
      (a, b) => a.dateObj - b.dateObj
    );
    sortedGroups.forEach((g) => {
      g.items.sort((a, b) => a.time.localeCompare(b.time));
    });
    return sortedGroups;
  };

// --- Загрузка расписания ---
const loadSchedule = async (userGroup) => {
  try {
    const response = await fetch('/Events1.json');
    if (!response.ok) throw new Error('Файл не найден');
    const data = await response.json();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // понедельник текущей недели
    const currentWeekStart = new Date(now);
    const wDay = currentWeekStart.getDay() || 7;
    if (wDay !== 1) currentWeekStart.setHours(-24 * (wDay - 1));
    currentWeekStart.setHours(0, 0, 0, 0);

    // понедельник следующей недели
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const currentWeekEvents = [];
    const nextWeekEvents = [];

    const placeIfInWeeks = (baseUiEvent, dateObj) => {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
      nextWeekEnd.setHours(23, 59, 59, 999);

      const item = {
        ...baseUiEvent,
        day: dateObj.toLocaleDateString('ru-RU', { weekday: 'long' }),
        dateObj,
      };

      if (dateObj >= currentWeekStart && dateObj <= weekEnd) {
        currentWeekEvents.push(item);
      } else if (dateObj >= nextWeekStart && dateObj <= nextWeekEnd) {
        nextWeekEvents.push(item);
      }
    };

    data.forEach((event) => {
  if (!event.group) return;

  // event.group может быть вида "МК24-01;МБ24-01;МБ24-02"
  const eventGroups = event.group
    .split(';')
    .map((g) => g.trim().toLowerCase())
    .filter(Boolean);

  const userGroupNorm = (userGroup || '').trim().toLowerCase();

  // строгая проверка принадлежности к одной из групп
  if (!userGroupNorm || !eventGroups.includes(userGroupNorm)) {
    return;
  }

      const startDate = parseDate(event.eventDateStartd);
      const weeklyRecurrence = Number(event.weeklyRecurrence || 0);
      const recurrenceEnd = event.recurrenceDateEndd
        ? parseDate(event.recurrenceDateEndd)
        : null;

      const baseUiEvent = {
        subject: event.EventName,
        type: event.EventType,
        time: `${event.eventDateStartTime} - ${event.eventDateEndTime}`,
        room: event.group || 'Ауд. уточняется',
      };

      // 1) daily: 6 — каждый будний день от start до end
      if (weeklyRecurrence === 6 && recurrenceEnd) {
        let d = new Date(startDate);
        d.setHours(0, 0, 0, 0);

        const endDate = new Date(recurrenceEnd);
        endDate.setHours(23, 59, 59, 999);

        while (d <= endDate) {
          const dow = d.getDay(); // 0=вс
          if (dow >= 1 && dow <= 6) {
            placeIfInWeeks(baseUiEvent, new Date(d));
          }
          d.setDate(d.getDate() + 1);
          d.setHours(0, 0, 0, 0);
        }
        return;
      }

      // 2) разовое: 0 — только указанная дата
      if (weeklyRecurrence === 0) {
        placeIfInWeeks(baseUiEvent, new Date(startDate));
        return;
      }

      // 3) еженедельное (1 и прочее) — с проверкой даты начала и окончания
      const dayOfWeek = startDate.getDay(); // 0–6
      const offset = (dayOfWeek + 6) % 7;

      // Проверяем дату окончания
      const endDate = recurrenceEnd || new Date('2099-12-31');
      endDate.setHours(23, 59, 59, 999);

      const thisWeekDate = new Date(currentWeekStart);
      thisWeekDate.setDate(thisWeekDate.getDate() + offset);
      thisWeekDate.setHours(0, 0, 0, 0);

      // Проверяем дату начала события
      const eventStartDate = new Date(startDate);
      eventStartDate.setHours(0, 0, 0, 0);

      // Добавляем только если событие уже началось И не закончилось
      if (thisWeekDate >= eventStartDate && thisWeekDate <= endDate) {
        placeIfInWeeks(baseUiEvent, thisWeekDate);
      }

      const nextWeekDate = new Date(nextWeekStart);
      nextWeekDate.setDate(nextWeekDate.getDate() + offset);
      nextWeekDate.setHours(0, 0, 0, 0);

      // Добавляем только если событие уже началось И не закончилось
      if (nextWeekDate >= eventStartDate && nextWeekDate <= endDate) {
        placeIfInWeeks(baseUiEvent, nextWeekDate);
      }

    });

    setSchedule({
      current: groupEventsByDay(currentWeekEvents),
      next: groupEventsByDay(nextWeekEvents),
    });
  } catch (err) {
    console.error('ОШИБКА:', err);
  }
};

  // --- Авторизация по двум email + сохранение профиля ---
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg('');

  try {
    const response = await fetch('/users.csv');
    const text = await response.text();
    const rows = text.split('\n').slice(1); // пропускаем заголовок
    let foundUser = null;

    rows.forEach((row) => {
      if (!row.trim()) return;

      const parts = row.split(';').map((s) => s.trim());

      const email = parts[0] || '';   // основная почта
      const email1 = parts[1] || '';  // доп. почта
      const name = parts[2] || '';
      const group = parts[3] || '';
      const chat = parts[4] || '';

      if (!email && !email1) return;

      const entered = loginForm.email.trim().toLowerCase();
      if (!entered) return;

      const e0 = email.toLowerCase();
      const e1 = email1.toLowerCase();

      if (entered === e0 || entered === e1) {
        // сохраняем тот email, который пользователь ввёл
        foundUser = { name, group, email: entered, chat };
      }
    });

    setTimeout(() => {
      if (foundUser) {
        setStudentData(foundUser);
        setIsAuth(true);
        loadSchedule(foundUser.group);

        try {
          localStorage.setItem('ysmu_student', JSON.stringify(foundUser));
        } catch (e) {
          console.warn('Не удалось сохранить профиль в localStorage', e);
        }
      } else {
        setErrorMsg('Пользователь с таким email не найден');
      }
      setIsLoading(false);
    }, 400);
  } catch (err) {
    console.error(err);
    setErrorMsg('Ошибка системы');
    setIsLoading(false);
  }
};

// --- Авто-логин из localStorage с проверкой актуальности данных ---
useEffect(() => {
  const checkAndUpdateUser = async () => {
    try {
      const saved = localStorage.getItem('ysmu_student');
      if (!saved) return;
      
      const user = JSON.parse(saved);
      if (!user || !user.group || !user.email) return;

      // Проверяем, есть ли поле chat
      if (!user.chat) {
        console.log('Обнаружены устаревшие данные, обновляем из CSV...');
        
        try {
          // Загружаем актуальные данные из CSV
          const response = await fetch('/users.csv');
          const text = await response.text();
          const rows = text.split('\n').slice(1);
          
          let updatedUser = null;
          rows.forEach((row) => {
            if (!row.trim()) return;
            const parts = row.split(';').map((s) => s.trim());
            
            const email = parts[0] || '';
            const email1 = parts[1] || '';
            const name = parts[2] || '';
            const group = parts[3] || '';
            const chat = parts[4] || '';
            
            const e0 = email.toLowerCase();
            const e1 = email1.toLowerCase();
            const savedEmail = user.email.toLowerCase();
            
            if (savedEmail === e0 || savedEmail === e1) {
              updatedUser = { name, group, email: user.email, chat };
            }
          });
          
          if (updatedUser) {
            // Обновляем данные в state и localStorage
            setStudentData(updatedUser);
            localStorage.setItem('ysmu_student', JSON.stringify(updatedUser));
            setIsAuth(true);
            loadSchedule(updatedUser.group);
            console.log('Данные успешно обновлены!');
          } else {
            // Если пользователь не найден, используем старые данные
            setStudentData(user);
            setIsAuth(true);
            loadSchedule(user.group);
          }
        } catch (err) {
          console.warn('Не удалось обновить данные из CSV, используем сохраненные', err);
          // В случае ошибки используем старые данные
          setStudentData(user);
          setIsAuth(true);
          loadSchedule(user.group);
        }
      } else {
        // Данные актуальные
        setStudentData(user);
        setIsAuth(true);
        loadSchedule(user.group);
      }
    } catch (e) {
      console.warn('Не удалось прочитать профиль из localStorage', e);
    }
  };

  checkAndUpdateUser();
}, []);

// --- Выход ---
const handleLogout = () => {
  setIsAuth(false);
  setStudentData(null);
  setSchedule({ current: [], next: [] });
  setLoginForm({ email: '' });
  try {
    localStorage.removeItem('ysmu_student');
  } catch (e) {
    console.warn('Не удалось очистить localStorage', e);
  }
};



  const getEventColor = (type) => {
    const t = type.toLowerCase();
    if (t.includes('лекция')) return 'border-l-4 border-l-purple-500';
    if (t.includes('семинар')) return 'border-l-4 border-l-blue-500';
    if (t.includes('практика') || t.includes('практическое')) {
      return 'border-l-4 border-l-orange-500';
    }
    return 'border-l-4 border-l-slate-300';
  };

  const getEventBadgeColor = (type) => {
    const t = type.toLowerCase();
    if (t.includes('лекция')) return 'bg-purple-100 text-purple-700';
    if (t.includes('семинар')) return 'bg-blue-100 text-blue-700';
    if (t.includes('практика') || t.includes('практическое')) {
      return 'bg-orange-100 text-orange-700';
    }
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-10">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-white flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="ЯГМУ"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <span className="font-semibold text-sm text-slate-700 leading-tight">
            Личный кабинет
            <br />
            <span className="text-xs text-slate-400 font-normal">
              Студент ЯГМУ
            </span>
          </span>
        </div>

        {isAuth && studentData && (
          <div className="flex items-center gap-2">
            {/* Блок с именем */}
            <div className="flex items-center gap-3 bg-slate-50 pl-4 pr-2 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="text-right flex flex-col items-end">
                <p className="text-sm font-bold text-slate-700 leading-none truncate max-w-[120px]">
                  {studentData.name.split(' ')[0]}{' '}
                  {studentData.name.split(' ')[1]
                    ? studentData.name.split(' ')[1][0] + '.'
                    : ''}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
                <IconUser />
              </div>
            </div>

            {/* Кнопка поддержки */}
            <a
              href="https://max.ru/ciysmuru_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm"
              title="Поддержка"
            >
              <IconSupport />
            </a>

            {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className="w-11 h-11 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
              title="Выйти"
            >
              <IconLogOut />
            </button>
          </div>
        )}
      </header>

      <main className="px-4 py-6 max-w-md mx-auto flex flex-col gap-6">
        {!isAuth ? (
          <div className="flex flex-col items-center justify-center pt-10 gap-6 animate-fade-in">
            <div className="text-center space-y-2 mb-4">
              <h1 className="text-2xl font-bold text-slate-900">Авторизация</h1>
              <p className="text-slate-500 text-sm">Введите адрес электронной почты или логин ЭИОС ЯГМУ</p>
            </div>

            <form
              onSubmit={handleLogin}
              className="w-full space-y-4 bg-white p-6 rounded-2xl shadow-md border border-slate-100"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Логин или адрес электронной почты"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg flex items-center gap-2">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 transition-all relative overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-300 group">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 z-10 group-hover:scale-110 transition-transform duration-300">
                  <IconGroup />
                </div>
                <div className="z-10">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Группа
                  </p>
                  <p className="text-xl font-bold text-slate-800 leading-tight mt-1">
                    {studentData.group}
                  </p>
                </div>
              </div>

              {studentData.chat ? (
  <a
    href={studentData.chat}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 transition-all relative overflow-hidden cursor-pointer hover:shadow-md hover:border-emerald-300 group"
  >
    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 z-10 group-hover:scale-110 transition-transform duration-300">
      <IconMessage />
    </div>
    <div className="z-10">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
        Чат группы
      </p>
      <div className="flex items-center gap-1 text-emerald-600 font-bold mt-1">
        <span>Открыть</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  </a>
) : (
  <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 rounded-2xl shadow-xl opacity-50 cursor-not-allowed h-32 flex flex-col justify-between">
    <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center mb-2 z-10">
      <IconMessage />
    </div>
    <div className="z-10">
      <p className="text-xs text-gray-100 font-medium uppercase tracking-wider">
        Чат группы
      </p>
      <div className="flex items-center gap-1 text-white font-bold mt-1">
        <span>Недоступно</span>
      </div>
    </div>
  </div>
)}
            </div>

            <div className="mt-6 animate-slide-up-delay">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <IconCalendar /> Расписание
                </h2>
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex text-xs font-bold">
                  <button
                    onClick={() => setWeekType('current')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      weekType === 'current'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Текущая
                  </button>
                  <button
                    onClick={() => setWeekType('next')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      weekType === 'next'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    След.
                  </button>
                </div>
              </div>

              <div className="space-y-8 pb-12">
                {schedule[weekType].length > 0 ? (
                  schedule[weekType].map((dayGroup, idx) => (
                    <div key={idx}>
                      <div className="flex items:end gap-3 mb-3 px-2">
                        <h3 className="text-3xl font-black text-slate-300 leading-none">
                          {dayGroup.dayLabel}
                        </h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 bg-slate-200 px-2 py-0.5 rounded-md">
                          {dayGroup.fullDate}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {dayGroup.items.map((item, i) => (
                          <div
                            key={i}
                            className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all ${getEventColor(
                              item.type
                            )} overflow-hidden`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-slate-800 text-sm leading-snug pr-2">
                                {item.subject}
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide whitespace-nowrap ${getEventBadgeColor(
                                  item.type
                                )}`}
                              >
                                {item.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                              <IconClock />
                              {item.time}
                            </div>
                            <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 flex items-start gap-2">
                              <span className="text-xs mt-0.5">📍</span>
                              <p className="text-xs text-slate-600 font-medium break-words leading-tight">
                                {item.room}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-4xl mb-2">😴</p>
                    <p className="text-slate-500 font-medium">
                      На этой неделе пар нет
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Можно отдыхать</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
