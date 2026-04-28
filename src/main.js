import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './assets/styles/global.less'
import { Button, Cell, CellGroup, Icon, Image, Tabbar, TabbarItem, NavBar, Search, Swipe, SwipeItem, Tag, Card, Rate, Grid, GridItem, Divider, ActionSheet, Popup, Overlay, Loading, Notify, Toast, Dialog, Form, Field, PasswordInput, NumberKeyboard, Empty, PullRefresh, List, Tab, Tabs, Step, Steps, Progress, RadioGroup, Radio, Checkbox, CheckboxGroup, Slider, Uploader, Circle } from 'vant'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(Icon)
app.use(Image)
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Search)
app.use(Swipe)
app.use(SwipeItem)
app.use(Tag)
app.use(Card)
app.use(Rate)
app.use(Grid)
app.use(GridItem)
app.use(Divider)
app.use(ActionSheet)
app.use(Popup)
app.use(Overlay)
app.use(Loading)
app.use(Notify)
app.use(Toast)
app.use(Dialog)
app.use(Form)
app.use(Field)
app.use(PasswordInput)
app.use(NumberKeyboard)
app.use(Empty)
app.use(PullRefresh)
app.use(List)
app.use(Tab)
app.use(Tabs)
app.use(Step)
app.use(Steps)
app.use(Progress)
app.use(RadioGroup)
app.use(Radio)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Slider)
app.use(Uploader)
app.use(Circle)

app.mount('#app')
