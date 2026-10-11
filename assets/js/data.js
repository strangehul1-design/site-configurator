/* ═══════════════════════════════════════════════════════════════
   Содержимое конфигуратора: нишы, оформления, блоки и подписи.

   Всё, что видно на странице и в предпросмотре, лежит здесь - в двух
   языках. Тексты предпросмотра намеренно сделаны заполнителями:
   цены показаны как «от 0 000 ₽», отзывы и адрес - подписями о том,
   что сюда встанут настоящие. Выдуманных цифр и отзывов нет.
   ═══════════════════════════════════════════════════════════════ */

window.CFG = (function () {
  'use strict';

  /* ── Оформления ───────────────────────────────────────────────
     tokens попадают в <style> предпросмотра как CSS-переменные. */
  var themes = [
    {
      id: 'minimal',
      label: { ru: 'Светлый минимализм', en: 'Light minimal' },
      hint: { ru: 'много воздуха, строгая сетка', en: 'airy, strict grid' },
      swatch: ['#FFFFFF', '#111418', '#2F5BFF'],
      font: 'family=Inter:wght@400;500&family=Manrope:wght@500;800',
      tokens: {
        bg: '#FFFFFF', surface: '#F4F6F9', ink: '#111418', muted: '#5A6472',
        line: '#E2E6EC', accent: '#2F5BFF', 'on-accent': '#FFFFFF', 'accent-2': '#2F5BFF', 'accent-soft': 'rgba(47,91,255,.08)',
        display: "'Manrope', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif",
        'display-weight': '800', 'display-tracking': '-.03em', 'display-case': 'none',
        radius: '16px', 'radius-sm': '10px', 'btn-radius': '10px',
        'hero-pad': '88px', shadow: '0 18px 40px rgba(17,20,24,.07)'
      }
    },
    {
      id: 'noir',
      label: { ru: 'Тёмный контраст', en: 'Dark contrast' },
      hint: { ru: 'крупный шрифт, яркий акцент', en: 'big type, bright accent' },
      swatch: ['#0C0D10', '#F2F4F7', '#6F4BF5'],
      font: 'family=Inter:wght@400;500&family=Montserrat:wght@600;800',
      tokens: {
        bg: '#0C0D10', surface: '#15171C', ink: '#F2F4F7', muted: '#A2AAB8',
        line: '#262A31', accent: '#6F4BF5', 'on-accent': '#FFFFFF', 'accent-2': '#9C8AFF', 'accent-soft': 'rgba(111,75,245,.18)',
        display: "'Montserrat', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif",
        'display-weight': '800', 'display-tracking': '-.02em', 'display-case': 'uppercase',
        radius: '8px', 'radius-sm': '6px', 'btn-radius': '4px',
        'hero-pad': '96px', shadow: '0 18px 44px rgba(0,0,0,.45)'
      }
    },
    {
      id: 'warm',
      label: { ru: 'Тёплый пастельный', en: 'Warm pastel' },
      hint: { ru: 'мягкие формы, антиква', en: 'soft shapes, serif' },
      swatch: ['#FBF7F2', '#221B16', '#A8512C'],
      font: 'family=Inter:wght@400;500&family=Playfair+Display:wght@500;700',
      tokens: {
        bg: '#FBF7F2', surface: '#FFFFFF', ink: '#221B16', muted: '#6B5B50',
        line: '#EADFD3', accent: '#A8512C', 'on-accent': '#FFFFFF', 'accent-2': '#A8512C', 'accent-soft': 'rgba(168,81,44,.10)',
        display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif",
        'display-weight': '700', 'display-tracking': '-.01em', 'display-case': 'none',
        radius: '24px', 'radius-sm': '16px', 'btn-radius': '999px',
        'hero-pad': '80px', shadow: '0 20px 44px rgba(34,27,22,.10)'
      }
    },
    {
      id: 'strict',
      label: { ru: 'Строгий деловой', en: 'Business formal' },
      hint: { ru: 'плотная сетка, тонкие линии', en: 'dense grid, hairlines' },
      swatch: ['#F7F8FA', '#0E1726', '#11467D'],
      font: 'family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400',
      tokens: {
        bg: '#F7F8FA', surface: '#FFFFFF', ink: '#0E1726', muted: '#4A5568',
        line: '#D9DEE7', accent: '#11467D', 'on-accent': '#FFFFFF', 'accent-2': '#11467D', 'accent-soft': 'rgba(17,70,125,.08)',
        display: "'IBM Plex Sans', system-ui, sans-serif", body: "'IBM Plex Sans', system-ui, sans-serif",
        'display-weight': '600', 'display-tracking': '-.01em', 'display-case': 'none',
        radius: '6px', 'radius-sm': '4px', 'btn-radius': '4px',
        'hero-pad': '72px', shadow: '0 10px 28px rgba(14,23,38,.08)'
      }
    }
  ];

  /* ── Блоки, которые можно включить ────────────────────────────
     Порядок в массиве = порядок на собранной странице. */
  var blocks = [
    { id: 'gallery', label: { ru: 'Галерея работ', en: 'Work gallery' }, hint: { ru: 'сетка фотографий', en: 'photo grid' }, on: true },
    { id: 'price', label: { ru: 'Прайс', en: 'Price list' }, hint: { ru: 'список услуг с ценами', en: 'services with prices' }, on: true },
    { id: 'reviews', label: { ru: 'Отзывы', en: 'Reviews' }, hint: { ru: 'карточки с отзывами', en: 'review cards' }, on: false },
    { id: 'faq', label: { ru: 'Вопросы и ответы', en: 'FAQ' }, hint: { ru: 'снимает типовые вопросы', en: 'answers the usual questions' }, on: false },
    { id: 'booking', label: { ru: 'Онлайн-запись', en: 'Online booking' }, hint: { ru: 'выбор дня и времени', en: 'day and time picker' }, on: false },
    { id: 'map', label: { ru: 'Карта и адрес', en: 'Map and address' }, hint: { ru: 'как добраться', en: 'how to get there' }, on: false },
    { id: 'form', label: { ru: 'Форма заявки', en: 'Request form' }, hint: { ru: 'заявка приходит вам', en: 'requests come to you' }, on: true },
    { id: 'messengers', label: { ru: 'Кнопки мессенджеров', en: 'Messenger buttons' }, hint: { ru: 'кружок в углу экрана', en: 'floating corner button' }, on: true }
  ];

  /* ── Нишы ────────────────────────────────────────────────────
     brand - выдуманное демо-название, так и подписано в предпросмотре. */
  var niches = [
    {
      id: 'bakery',
      icon: 'cake',
      label: { ru: 'Кондитерская и кафе', en: 'Bakery & café' },
      hint: { ru: 'торты на заказ, доставка', en: 'custom cakes, delivery' },
      brand: { ru: 'Сахарная нить', en: 'Sugar Thread' },
      mark: { ru: 'СН', en: 'ST' },
      nav: { ru: ['Торты', 'Цены', 'Доставка', 'Контакты'], en: ['Cakes', 'Prices', 'Delivery', 'Contact'] },
      h1: { ru: 'Торты на заказ<br>для домашних праздников', en: 'Custom cakes<br>for family celebrations' },
      lead: {
        ru: 'Собираем вкус, начинку и оформление под повод. Привозим ко дню и часу - по городу и пригороду.',
        en: 'Flavour, filling and decoration built around the occasion. Delivered on the day and hour you need, across the city and nearby.'
      },
      cta: { ru: 'Рассчитать торт', en: 'Price my cake' },
      cta2: { ru: 'Посмотреть работы', en: 'See the cakes' },
      stats: {
        ru: [['Срок', 'от 2 дней'], ['Доставка', 'по городу'], ['Начинок', '12 на выбор']],
        en: [['Lead time', 'from 2 days'], ['Delivery', 'citywide'], ['Fillings', '12 to choose']]
      },
      services: {
        ru: [
          ['Торты на заказ', 'Высота, ярусы, надпись и цвет - под ваш повод.'],
          ['Наборы пирожных', 'Для подарка, фуршета или офиса.'],
          ['Свадебный стол', 'Торт и десерты в одном оформлении.']
        ],
        en: [
          ['Custom cakes', 'Height, tiers, lettering and colour to match the occasion.'],
          ['Pastry boxes', 'For a gift, a buffet or the office.'],
          ['Wedding table', 'Cake and desserts in one look.']
        ]
      },
      gallery: { ru: ['Ярусный торт', 'Бенто-торт', 'Пирожные', 'Оформление стола'], en: ['Tiered cake', 'Bento cake', 'Pastries', 'Dessert table'] },
      price: {
        ru: [['Бенто-торт', '400-500 г'], ['Торт один ярус', '1,5-3 кг'], ['Два яруса', 'от 4 кг']],
        en: [['Bento cake', '400-500 g'], ['Single tier', '1.5-3 kg'], ['Two tiers', 'from 4 kg']]
      },
      faq: {
        ru: [['За сколько дней заказывать?', 'Здесь будет ваш ответ про срок заказа.'], ['Можно без мастики?', 'Здесь будет ваш ответ про оформление.'], ['Как с доставкой?', 'Здесь будет ваш ответ про доставку и самовывоз.']],
        en: [['How far ahead should I order?', 'Your answer about lead time goes here.'], ['Can you skip fondant?', 'Your answer about decoration goes here.'], ['What about delivery?', 'Your answer about delivery and pickup goes here.']]
      },
      place: { ru: ['Кондитерская', 'Адрес подставим ваш', 'Пн-Сб, 10:00-20:00'], en: ['Bakery', 'Your address goes here', 'Mon-Sat, 10:00-20:00'] }
    },
    {
      id: 'fitness',
      icon: 'bolt',
      label: { ru: 'Фитнес и спорт', en: 'Fitness & sport' },
      hint: { ru: 'студия, тренер, групповые', en: 'studio, coach, classes' },
      brand: { ru: 'Темп', en: 'Tempo' },
      mark: { ru: 'ТМ', en: 'TM' },
      nav: { ru: ['Тренировки', 'Тренеры', 'Цены', 'Контакты'], en: ['Training', 'Coaches', 'Prices', 'Contact'] },
      h1: { ru: 'Силовые тренировки<br>малыми группами', en: 'Strength training<br>in small groups' },
      lead: {
        ru: 'До шести человек в зале, план под уровень и разбор техники на каждом занятии.',
        en: 'Up to six people in the room, a plan for your level and technique checks every session.'
      },
      cta: { ru: 'Пробное занятие', en: 'Book a trial' },
      cta2: { ru: 'Расписание', en: 'Timetable' },
      stats: {
        ru: [['В группе', 'до 6 человек'], ['Занятие', '55 минут'], ['Зал', 'адрес ваш']],
        en: [['Group size', 'up to 6'], ['Session', '55 minutes'], ['Studio', 'your address']]
      },
      services: {
        ru: [
          ['Групповые', 'Силовая, мобильность и выносливость по расписанию.'],
          ['Персонально', 'Один на один: техника, план, контроль.'],
          ['Для новичков', 'Четыре занятия, чтобы разобраться в базе.']
        ],
        en: [
          ['Group classes', 'Strength, mobility and conditioning on a timetable.'],
          ['One to one', 'Technique, a plan and someone watching the bar.'],
          ['Beginner course', 'Four sessions to learn the basics.']
        ]
      },
      gallery: { ru: ['Зал', 'Тренировка', 'Оборудование', 'Команда'], en: ['The room', 'A session', 'Equipment', 'The team'] },
      price: {
        ru: [['Пробное', 'первое занятие'], ['Абонемент 8', 'на месяц'], ['Персонально', 'за занятие']],
        en: [['Trial', 'first session'], ['8 classes', 'per month'], ['One to one', 'per session']]
      },
      faq: {
        ru: [['Я никогда не тренировался', 'Здесь будет ваш ответ про новичков.'], ['Что взять с собой?', 'Здесь будет ваш ответ про форму и воду.'], ['Можно заморозить абонемент?', 'Здесь будет ваш ответ про заморозку.']],
        en: [['I have never trained', 'Your answer for beginners goes here.'], ['What should I bring?', 'Your answer about kit goes here.'], ['Can I freeze my pass?', 'Your answer about freezing goes here.']]
      },
      place: { ru: ['Студия', 'Адрес подставим ваш', 'Ежедневно, 07:00-22:00'], en: ['Studio', 'Your address goes here', 'Daily, 07:00-22:00'] }
    },
    {
      id: 'beauty',
      icon: 'spark',
      label: { ru: 'Красота и уход', en: 'Beauty & care' },
      hint: { ru: 'салон, мастер, запись', en: 'salon, stylist, booking' },
      brand: { ru: 'Линия', en: 'Linea' },
      mark: { ru: 'ЛН', en: 'LN' },
      nav: { ru: ['Услуги', 'Мастера', 'Цены', 'Запись'], en: ['Services', 'Stylists', 'Prices', 'Booking'] },
      h1: { ru: 'Уход и причёска<br>без спешки', en: 'Hair and care<br>without the rush' },
      lead: {
        ru: 'Один мастер на одного гостя, подбор ухода под ваши волосы и запись в удобное время.',
        en: 'One stylist per guest, care picked for your hair and a time that suits you.'
      },
      cta: { ru: 'Записаться', en: 'Book a visit' },
      cta2: { ru: 'Услуги и цены', en: 'Services & prices' },
      stats: {
        ru: [['Приём', 'по записи'], ['Визит', 'от 60 минут'], ['Мастеров', 'в команде 4']],
        en: [['Visits', 'by appointment'], ['Session', 'from 60 minutes'], ['Stylists', '4 in the team']]
      },
      services: {
        ru: [
          ['Стрижка и укладка', 'Форма под тип волос и привычку к уходу.'],
          ['Окрашивание', 'Тон, осветление, тонирование.'],
          ['Уход', 'Программы для сухих и повреждённых волос.']
        ],
        en: [
          ['Cut and styling', 'A shape that fits your hair and routine.'],
          ['Colour', 'Tone, lightening, glossing.'],
          ['Treatments', 'Programmes for dry and damaged hair.']
        ]
      },
      gallery: { ru: ['До и после', 'Окрашивание', 'Салон', 'Мастер за работой'], en: ['Before & after', 'Colour work', 'The salon', 'At work'] },
      price: {
        ru: [['Стрижка', 'женская, мужская'], ['Окрашивание', 'в один тон'], ['Уход', 'за процедуру']],
        en: [['Haircut', "women's, men's"], ['Single-tone colour', 'per visit'], ['Treatment', 'per session']]
      },
      faq: {
        ru: [['Сколько длится окрашивание?', 'Здесь будет ваш ответ про время.'], ['Нужна консультация?', 'Здесь будет ваш ответ про подбор.'], ['Как отменить запись?', 'Здесь будет ваш ответ про отмену.']],
        en: [['How long does colour take?', 'Your answer about timing goes here.'], ['Do I need a consultation?', 'Your answer about consultations goes here.'], ['How do I cancel?', 'Your answer about cancelling goes here.']]
      },
      place: { ru: ['Салон', 'Адрес подставим ваш', 'Пн-Вс, 09:00-21:00'], en: ['Salon', 'Your address goes here', 'Mon-Sun, 09:00-21:00'] }
    },
    {
      id: 'craft',
      icon: 'hand',
      label: { ru: 'Мастерская и ручная работа', en: 'Workshop & handmade' },
      hint: { ru: 'керамика, мебель, занятия', en: 'ceramics, furniture, classes' },
      brand: { ru: 'Глина и свет', en: 'Clay & Light' },
      mark: { ru: 'ГС', en: 'CL' },
      nav: { ru: ['Работы', 'Занятия', 'Цены', 'Контакты'], en: ['Work', 'Classes', 'Prices', 'Contact'] },
      h1: { ru: 'Посуда и предметы<br>ручной работы', en: 'Handmade tableware<br>and objects' },
      lead: {
        ru: 'Делаем небольшими партиями и на заказ. В мастерской проходят занятия для новичков и пар.',
        en: 'Made in small batches and to order. The workshop also runs classes for beginners and couples.'
      },
      cta: { ru: 'Написать мастеру', en: 'Message the maker' },
      cta2: { ru: 'Занятия', en: 'Classes' },
      stats: {
        ru: [['Заказ', 'от 2 недель'], ['Занятие', '2 часа'], ['Мастерская', 'адрес ваш']],
        en: [['Order', 'from 2 weeks'], ['Class', '2 hours'], ['Workshop', 'your address']]
      },
      services: {
        ru: [
          ['На заказ', 'Сервиз, набор для кафе, подарок с надписью.'],
          ['Занятия', 'Гончарный круг и лепка, всё для работы на месте.'],
          ['Готовые работы', 'То, что уже стоит на полке мастерской.']
        ],
        en: [
          ['Made to order', 'A dinner set, pieces for a café, a gift with lettering.'],
          ['Classes', 'Wheel and hand-building, everything provided.'],
          ['Ready pieces', 'What is already on the workshop shelf.']
        ]
      },
      gallery: { ru: ['Посуда', 'Процесс', 'Мастерская', 'Занятие'], en: ['Tableware', 'Process', 'The workshop', 'A class'] },
      price: {
        ru: [['Занятие', 'на одного'], ['Занятие для пары', 'два человека'], ['Изделие на заказ', 'за предмет']],
        en: [['Class', 'one person'], ['Class for two', 'two people'], ['Made to order', 'per piece']]
      },
      faq: {
        ru: [['Нужен опыт?', 'Здесь будет ваш ответ про уровень.'], ['Когда забирать изделие?', 'Здесь будет ваш ответ про обжиг и сроки.'], ['Делаете подарочные сертификаты?', 'Здесь будет ваш ответ про сертификаты.']],
        en: [['Do I need experience?', 'Your answer about skill level goes here.'], ['When can I collect my piece?', 'Your answer about firing and timing goes here.'], ['Do you sell gift cards?', 'Your answer about gift cards goes here.']]
      },
      place: { ru: ['Мастерская', 'Адрес подставим ваш', 'Вт-Сб, 11:00-19:00'], en: ['Workshop', 'Your address goes here', 'Tue-Sat, 11:00-19:00'] }
    },
    {
      id: 'repair',
      icon: 'tool',
      label: { ru: 'Ремонт и монтаж', en: 'Repair & installation' },
      hint: { ru: 'выезд, замер, гарантия', en: 'call-out, survey, warranty' },
      brand: { ru: 'Мастер рядом', en: 'Handy Near' },
      mark: { ru: 'МР', en: 'HN' },
      nav: { ru: ['Услуги', 'Цены', 'Как работаем', 'Контакты'], en: ['Services', 'Prices', 'How it works', 'Contact'] },
      h1: { ru: 'Ремонт и монтаж<br>с выездом в день заявки', en: 'Repairs and installs<br>on the day you call' },
      lead: {
        ru: 'Приедем, посмотрим на месте и назовём цену до начала работ. Гарантию пишем в договоре.',
        en: 'We come out, look at the job and name the price before starting. The warranty is in the contract.'
      },
      cta: { ru: 'Вызвать мастера', en: 'Request a visit' },
      cta2: { ru: 'Цены', en: 'Prices' },
      stats: {
        ru: [['Выезд', 'в день заявки'], ['Замер', 'бесплатно'], ['Гарантия', 'в договоре']],
        en: [['Call-out', 'same day'], ['Survey', 'free'], ['Warranty', 'in writing']]
      },
      services: {
        ru: [
          ['Электрика', 'Розетки, свет, щиток, поиск неисправности.'],
          ['Сантехника', 'Смесители, трубы, подключение техники.'],
          ['Мелкий ремонт', 'Двери, мебель, карнизы, навеска.']
        ],
        en: [
          ['Electrics', 'Sockets, lighting, panels, fault finding.'],
          ['Plumbing', 'Taps, pipes, appliance hook-ups.'],
          ['Odd jobs', 'Doors, furniture, rails, mounting.']
        ]
      },
      gallery: { ru: ['Работа на объекте', 'До и после', 'Инструмент', 'Бригада'], en: ['On site', 'Before & after', 'Tools', 'The crew'] },
      price: {
        ru: [['Выезд и замер', 'по городу'], ['Замена розетки', 'за точку'], ['Установка смесителя', 'за единицу']],
        en: [['Call-out and survey', 'citywide'], ['Socket replacement', 'per point'], ['Tap installation', 'per unit']]
      },
      faq: {
        ru: [['Когда сможете приехать?', 'Здесь будет ваш ответ про сроки выезда.'], ['Материалы ваши или мои?', 'Здесь будет ваш ответ про материалы.'], ['Есть договор и гарантия?', 'Здесь будет ваш ответ про документы.']],
        en: [['When can you come?', 'Your answer about availability goes here.'], ['Who buys the parts?', 'Your answer about materials goes here.'], ['Is there a contract?', 'Your answer about paperwork goes here.']]
      },
      place: { ru: ['Район работы', 'Город подставим ваш', 'Пн-Вс, 08:00-21:00'], en: ['Service area', 'Your city goes here', 'Mon-Sun, 08:00-21:00'] }
    },
    {
      id: 'expert',
      icon: 'book',
      label: { ru: 'Онлайн-курс и эксперт', en: 'Course & expert' },
      hint: { ru: 'обучение, консультации', en: 'teaching, consulting' },
      brand: { ru: 'Понятным языком', en: 'Plain Words' },
      mark: { ru: 'ПЯ', en: 'PW' },
      nav: { ru: ['Программа', 'Кому', 'Цена', 'Записаться'], en: ['Programme', 'Who for', 'Price', 'Join'] },
      h1: { ru: 'Курс, после которого<br>вы сделаете это сами', en: 'A course that leaves you<br>able to do it yourself' },
      lead: {
        ru: 'Восемь занятий, разбор домашних работ и доступ к записям. Группы небольшие, вопросы можно задавать по ходу.',
        en: 'Eight sessions, feedback on your homework and access to the recordings. Small groups, questions welcome as you go.'
      },
      cta: { ru: 'Записаться на курс', en: 'Join the course' },
      cta2: { ru: 'Программа', en: 'Programme' },
      stats: {
        ru: [['Занятий', '8'], ['Формат', 'онлайн'], ['Группа', 'до 12 человек']],
        en: [['Sessions', '8'], ['Format', 'online'], ['Group', 'up to 12']]
      },
      services: {
        ru: [
          ['Курс в группе', 'Занятия по расписанию, разбор работ, записи.'],
          ['Консультация', 'Час один на один по вашей задаче.'],
          ['Разбор материалов', 'Посмотрю, что у вас есть, и скажу, что поправить.']
        ],
        en: [
          ['Group course', 'Scheduled sessions, homework feedback, recordings.'],
          ['Consultation', 'An hour one to one on your task.'],
          ['Material review', "I look at what you have and say what to fix."]
        ]
      },
      gallery: { ru: ['Занятие', 'Материалы', 'Работы учеников', 'Разбор'], en: ['A session', 'Materials', 'Student work', 'Feedback'] },
      price: {
        ru: [['Курс', '8 занятий'], ['Курс с разбором', 'с проверкой работ'], ['Консультация', 'час']],
        en: [['Course', '8 sessions'], ['Course with feedback', 'homework reviewed'], ['Consultation', 'one hour']]
      },
      faq: {
        ru: [['Подойдёт новичку?', 'Здесь будет ваш ответ про уровень.'], ['Будут записи?', 'Здесь будет ваш ответ про доступ к записям.'], ['Можно оплатить частями?', 'Здесь будет ваш ответ про оплату.']],
        en: [['Is it good for beginners?', 'Your answer about level goes here.'], ['Will there be recordings?', 'Your answer about access goes here.'], ['Can I pay in parts?', 'Your answer about payment goes here.']]
      },
      place: { ru: ['Формат', 'Онлайн, ссылку присылаем', 'Занятия вечером'], en: ['Format', 'Online, link sent to you', 'Evening sessions'] }
    }
  ];

  /* ── Подписи интерфейса ──────────────────────────────────────── */
  var ui = {
    ru: {
      steps: ['Ниша', 'Оформление', 'Блоки', 'Что получилось'],
      stepNote: [
        'Ближе всего к вашему делу: тексты справа подставятся под неё.',
        'Цвета, шрифты и форма кнопок. Содержимое останется тем же.',
        'Что должно быть на странице. Первый экран и услуги есть всегда.',
        'Сборка целиком и как она ко мне попадёт.'
      ],
      previewTitle: 'Собранный сайт',
      blocksN: ['блок', 'блока', 'блоков'],
      inBuild: 'в сборке',
      tallyPrice: 'от 26 000 ₽ под ключ',
      briefNiche: 'Ниша',
      briefTheme: 'Оформление',
      briefBlocks: 'Блоки',
      none: 'нет',
      priceMain: 'Сайт под ключ от 26 000 ₽',
      priceMainNote: 'От идеи до запуска: страница, тексты по вашим данным, форма заявки, публикация.',
      priceRows: [['Хостинг', '5 038 ₽ в год'], ['Домен .ru', '169 ₽ в год']],
      priceNote: 'Хостинг и домен оплачиваются напрямую у регистратора. Точную смету по вашему набору блоков пришлю после короткого разговора: цифры за каждый блок я не придумываю.',
      tg: 'Написать в Telegram',
      tgNote: 'Сборка копируется в буфер: вставьте её в сообщение.',
      mail: 'Письмо на почту',
      copyLink: 'Скопировать ссылку',
      copyLinkNote: 'Ссылка открывает ровно эту сборку.',
      copied: 'Скопировано',
      vk: 'ВКонтакте',
      briefHead: 'Сборка сайта',
      briefLine: ['Ниша', 'Оформление', 'Блоки', 'Ссылка на сборку'],
      mailSubject: 'Сборка сайта из конфигуратора'
    },
    en: {
      steps: ['Niche', 'Look', 'Blocks', 'Your build'],
      stepNote: [
        'Closest to your business: the text on the right follows your choice.',
        'Colours, type and button shape. The content stays the same.',
        'What goes on the page. The first screen and services are always there.',
        'The whole build and how it reaches me.'
      ],
      previewTitle: 'The assembled site',
      blocksN: ['block', 'blocks'],
      inBuild: 'in the build',
      tallyPrice: 'from 26 000 ₽, start to finish',
      briefNiche: 'Niche',
      briefTheme: 'Look',
      briefBlocks: 'Blocks',
      none: 'none',
      priceMain: 'Site, start to finish, from 26 000 ₽',
      priceMainNote: 'From idea to launch: the page, copy based on your material, a request form, publishing.',
      priceRows: [['Hosting', '5 038 ₽ a year'], ['.ru domain', '169 ₽ a year']],
      priceNote: 'Hosting and the domain are paid directly to the registrar. I will send an exact quote for your set of blocks after a short talk: I do not invent a per-block price list.',
      tg: 'Message on Telegram',
      tgNote: 'The build is copied to your clipboard: paste it into the chat.',
      mail: 'Send an email',
      copyLink: 'Copy the link',
      copyLinkNote: 'The link opens exactly this build.',
      copied: 'Copied',
      vk: 'VK',
      briefHead: 'Website build',
      briefLine: ['Niche', 'Look', 'Blocks', 'Build link'],
      mailSubject: 'Website build from the configurator'
    }
  };

  /* ── Подписи внутри собранной страницы ───────────────────────── */
  var pv = {
    ru: {
      photo: 'ФОТО',
      services: 'Что мы делаем',
      gallery: 'Работы',
      galleryNote: 'Сюда встанут ваши фотографии',
      price: 'Цены',
      priceValue: 'от 0 000 ₽',
      priceNote: 'Цены подставим ваши',
      reviews: 'Отзывы',
      reviewText: 'Здесь будет отзыв клиента. Соберём настоящие - из сообщений, карт и соцсетей.',
      reviewName: 'Имя клиента',
      reviewSrc: 'источник отзыва',
      faq: 'Вопросы и ответы',
      booking: 'Онлайн-запись',
      bookingNote: 'Выберите день и время - заявка придёт вам в Telegram или на почту',
      bookingBtn: 'Записаться',
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      times: ['10:00', '12:30', '15:00', '18:30'],
      map: 'Как добраться',
      mapNote: 'Карта с вашей точкой',
      form: 'Оставить заявку',
      formNote: 'Отвечу в рабочее время. Форма в предпросмотре ничего не отправляет.',
      fields: ['Имя', 'Телефон или мессенджер', 'Что нужно'],
      formBtn: 'Отправить заявку',
      write: 'Написать',
      call: 'Позвонить',
      contacts: 'Контакты',
      phone: '+7 (000) 000-00-00',
      phoneNote: 'номер подставим ваш',
      footer: 'Демо-страница конфигуратора. Название вымышленное.'
    },
    en: {
      photo: 'PHOTO',
      services: 'What we do',
      gallery: 'Work',
      galleryNote: 'Your photographs go here',
      price: 'Prices',
      priceValue: 'from 0 000 ₽',
      priceNote: 'Your prices go here',
      reviews: 'Reviews',
      reviewText: 'A client review goes here. We collect the real ones from messages, maps and social media.',
      reviewName: 'Client name',
      reviewSrc: 'where it came from',
      faq: 'Questions and answers',
      booking: 'Online booking',
      bookingNote: 'Pick a day and time - the request reaches you on Telegram or by email',
      bookingBtn: 'Book',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      times: ['10:00', '12:30', '15:00', '18:30'],
      map: 'Getting here',
      mapNote: 'A map with your pin',
      form: 'Send a request',
      formNote: 'I reply during working hours. The form in the preview sends nothing.',
      fields: ['Name', 'Phone or messenger', 'What you need'],
      formBtn: 'Send the request',
      write: 'Message',
      call: 'Call',
      contacts: 'Contact',
      phone: '+7 (000) 000-00-00',
      phoneNote: 'your number goes here',
      footer: 'Configurator demo page. The business name is made up.'
    }
  };

  var contacts = {
    tg: 'tacokinggl1',
    vk: 'taco_kinggl1',
    mail: 'digitalgl1@mail.ru',
  };

  return { themes: themes, blocks: blocks, niches: niches, ui: ui, pv: pv, contacts: contacts };
})();
