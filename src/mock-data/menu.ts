import type { MenuCategory, MenuItem } from '../types';

export const mockCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Завтраки', icon: '🍳', order: 1, isActive: true },
  { id: 'cat-2', name: 'Горячие блюда', icon: '🍽', order: 2, isActive: true },
  { id: 'cat-3', name: 'Салаты', icon: '🥗', order: 3, isActive: true },
  { id: 'cat-4', name: 'Супы', icon: '🍜', order: 4, isActive: true },
  { id: 'cat-5', name: 'Десерты', icon: '🍰', order: 5, isActive: true },
  { id: 'cat-6', name: 'Кофе', icon: '☕', order: 6, isActive: true },
  { id: 'cat-7', name: 'Чай', icon: '🫖', order: 7, isActive: true },
  { id: 'cat-8', name: 'Напитки', icon: '🥤', order: 8, isActive: true },
  { id: 'cat-9', name: 'Выпечка', icon: '🥐', order: 9, isActive: true },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: 'mi-1', categoryId: 'cat-6', name: 'Эспрессо', price: 180,
    description: 'Классический итальянский эспрессо из зерновой смеси',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 3, popular: true,
    modifiers: ['Двойной', 'Тройной'],
  },
  {
    id: 'mi-2', categoryId: 'cat-6', name: 'Капучино', price: 280,
    description: 'Нежный капучино с воздушной молочной пеной',
    image: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 4, popular: true,
    modifiers: ['Мал 200мл', 'Бол 400мл', 'Без сахара', 'Соевое молоко', 'Овсяное молоко'],
  },
  {
    id: 'mi-3', categoryId: 'cat-6', name: 'Латте', price: 320,
    description: 'Мягкий латте с большим количеством молока',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 5, popular: true,
    modifiers: ['Ванильный', 'Карамельный', 'Овсяное молоко'],
  },
  {
    id: 'mi-4', categoryId: 'cat-6', name: 'Флэт Уайт', price: 300,
    description: 'Насыщенный кофе с микропеной из молока',
    image: 'https://images.pexels.com/photos/1170659/pexels-photo-1170659.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 4,
  },
  {
    id: 'mi-5', categoryId: 'cat-6', name: 'Американо', price: 220,
    description: 'Классический американо — длинный чёрный кофе',
    image: 'https://images.pexels.com/photos/4349925/pexels-photo-4349925.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 3,
  },
  {
    id: 'mi-6', categoryId: 'cat-6', name: 'Раф кофе', price: 380,
    description: 'Кремовый раф с ванилью и сливками',
    image: 'https://images.pexels.com/photos/5946606/pexels-photo-5946606.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: false, isStopList: true, prepTime: 5,
  },
  {
    id: 'mi-7', categoryId: 'cat-7', name: 'Зелёный чай', price: 200,
    description: 'Японский зелёный чай сенча',
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 5,
  },
  {
    id: 'mi-8', categoryId: 'cat-7', name: 'Чай Эрл Грей', price: 180,
    description: 'Классический черный чай с бергамотом',
    image: 'https://images.pexels.com/photos/905485/pexels-photo-905485.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 4,
  },
  {
    id: 'mi-9', categoryId: 'cat-9', name: 'Круассан классический', price: 220,
    description: 'Слоёный маслянистый круассан из Франции',
    image: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 3, popular: true,
  },
  {
    id: 'mi-10', categoryId: 'cat-9', name: 'Круассан с миндалём', price: 280,
    description: 'Круассан с нежной миндальной начинкой и кремом',
    image: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 3,
  },
  {
    id: 'mi-11', categoryId: 'cat-1', name: 'Яичница Флорентин', price: 450,
    description: 'Яйца пашот на тосте с беконом и соусом голландез',
    image: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 12, popular: true,
  },
  {
    id: 'mi-12', categoryId: 'cat-1', name: 'Авокадо тост', price: 520,
    description: 'Тост с авокадо, яйцом пашот и томатами черри',
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 10, popular: true,
  },
  {
    id: 'mi-13', categoryId: 'cat-1', name: 'Панкейки', price: 480,
    description: 'Пышные панкейки с кленовым сиропом и ягодами',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 15,
  },
  {
    id: 'mi-14', categoryId: 'cat-2', name: 'Паста Карбонара', price: 680,
    description: 'Классическая итальянская карбонара с гуанчале',
    image: 'https://images.pexels.com/photos/4518671/pexels-photo-4518671.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 20, popular: true,
  },
  {
    id: 'mi-15', categoryId: 'cat-2', name: 'Ризотто с грибами', price: 720,
    description: 'Кремовое ризотто с белыми грибами и трюфельным маслом',
    image: 'https://images.pexels.com/photos/6086/food-salad-healthy-lunch.jpg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 25,
  },
  {
    id: 'mi-16', categoryId: 'cat-3', name: 'Греческий салат', price: 420,
    description: 'Свежие овощи, маслины и сыр фета с оливковым маслом',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 8,
  },
  {
    id: 'mi-17', categoryId: 'cat-5', name: 'Тирамису', price: 380,
    description: 'Классический итальянский тирамису с маскарпоне',
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 5, popular: true,
  },
  {
    id: 'mi-18', categoryId: 'cat-5', name: 'Чизкейк нью-йорк', price: 420,
    description: 'Нежный чизкейк с ягодным соусом',
    image: 'https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 5, popular: true,
  },
  {
    id: 'mi-19', categoryId: 'cat-8', name: 'Лимонад домашний', price: 320,
    description: 'Освежающий лимонад на мяте и лимоне',
    image: 'https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 5,
  },
  {
    id: 'mi-20', categoryId: 'cat-4', name: 'Суп томатный', price: 350,
    description: 'Крем-суп из запечённых томатов с базиликом',
    image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true, isStopList: false, prepTime: 10,
  },
];
