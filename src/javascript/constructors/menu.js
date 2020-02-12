import {puffin} from '@mkenzo_8/puffin'
import Dropmenu  from '../components/dropmenu'
import requirePath from '../utils/require'

const { remote } = requirePath("electron")

let MenuBarMacOS;

(function(){
    const { Menu } = remote

    MenuBarMacOS  = new Menu()
})()

function Menu({
    button,
    list
}){
    if(eval('process.platform') !== "darwin"){
        const methodsToBind = Object.assign({},list.map((option)=> option.action))
        const MenuComponent = puffin.element(`
            <Dropmenu>
                <button>${button}</button>
                <div>
                ${(function(){
                    let content = "";
                    list.map(function(option,index){
                        content += `<a click="$${index}">${option.label}</a>`
                    })
                    return content;
                })()}
                </div>
            </Dropmenu>
        `,{
            components:{
                Dropmenu
            },
            methods:methodsToBind
        })

        puffin.render(MenuComponent,document.getElementById("dropmenus"))
    }else{
        appendToBar(createTemplate(button,list))
    }
}

function createTemplate(button,list){
    const { MenuItem } = remote

    return new MenuItem({
        label:button,
        submenu:(function(){
           return list.map((btn)=>{
                return {
                    label:btn.label,
                    click:btn.action
                }
            })
        })()
    })
}

function appendToBar(item){
    const { Menu } = remote

    MenuBarMacOS.append(item)

    Menu.setApplicationMenu(MenuBarMacOS)
}


export default Menu