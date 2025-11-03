export default {
    namespaced: true,
    state: {
        vipoption: [
            {
                "id": 1,
                "name": "vip one",
                "icon": "",
                "editUrl": "",
                "options": [
                    { "name": "vipBudg" },
                    { "name": "enterEoomEffect" },
                    { "name": "untiBan" },
                    { "name": "moreSets" },
                    { "name": "costomSets" },
                    { "name": "gameRoom" },
                    { "name": "specialEntry" },
                    { "name": "specialFrame" },
                    { "name": "moreEmoje" },
                    { "name": "hideFromTop" },
                    { "name": "hideInRoom" },
                    { "name": "hideInLive" },
                    { "name": "hideLevel" },
                    { "name": "moreOptionInRooms" },
                    { "name": "costomBackground" },
                    { "name": "openRoom" },
                    { "name": "openLive" },
                    { "name": "vipSupport" },
                    { "name": "exclusiveGift" }
                ]
            },
            {
                "id": 2,
                "name": "vip two",
                "icon": "",
                "editUrl": "",
                "options": [
                    { "name": "vipBudg" },
                    { "name": "enterEoomEffect" },
                    { "name": "untiBan" },
                    { "name": "moreSets" },
                    { "name": "costomSets" },
                    { "name": "gameRoom" },
                    { "name": "specialEntry" },
                    { "name": "specialFrame" },
                    { "name": "moreEmoje" },
                    { "name": "hideFromTop" },
                    { "name": "hideInRoom" },
                    { "name": "hideInLive" },
                    { "name": "hideLevel" },
                    { "name": "moreOptionInRooms" },
                    { "name": "costomBackground" },
                    { "name": "openRoom" },
                    { "name": "openLive" },
                    { "name": "vipSupport" },
                    { "name": "exclusiveGift" }
                ]
            },
            {
                "id": 3,
                "name": "vip three",
                "icon": "",
                "editUrl": "",
                "options": [
                    { "name": "vipBudg" },
                    { "name": "enterEoomEffect" },
                    { "name": "untiBan" },
                    { "name": "moreSets" },
                    { "name": "costomSets" },
                    { "name": "gameRoom" },
                    { "name": "specialEntry" },
                    { "name": "specialFrame" },
                    { "name": "moreEmoje" },
                    { "name": "hideFromTop" },
                    { "name": "hideInRoom" },
                    { "name": "hideInLive" },
                    { "name": "hideLevel" },
                    { "name": "moreOptionInRooms" },
                    { "name": "costomBackground" },
                    { "name": "openRoom" },
                    { "name": "openLive" },
                    { "name": "vipSupport" },
                    { "name": "exclusiveGift" }
                ]
            },
            {
                "id": 4,
                "name": "vip four",
                "icon": "",
                "editUrl": "",
                "options": [
                    { "name": "vipBudg" },
                    { "name": "enterEoomEffect" },
                    { "name": "untiBan" },
                    { "name": "moreSets" },
                    { "name": "costomSets" },
                    { "name": "gameRoom" },
                    { "name": "specialEntry" },
                    { "name": "specialFrame" },
                    { "name": "moreEmoje" },
                    { "name": "hideFromTop" },
                    { "name": "hideInRoom" },
                    { "name": "hideInLive" },
                    { "name": "hideLevel" },
                    { "name": "moreOptionInRooms" },
                    { "name": "costomBackground" },
                    { "name": "openRoom" },
                    { "name": "openLive" },
                    { "name": "vipSupport" },
                    { "name": "exclusiveGift" }
                ]
            }
        ]
    },

    mutations : {
        setOptions(state,value){
            state.options = value ;
        },

        updateOption(state , value) {
            // find the option

            // since the value is comming by the vip id and the option id
            // ill do the mutaion here no in the api 

            // we destrcutre the valies

            const {vip_id , opt_id , opt_payload} = value;

            // now we get it from the state

            const vip = state.vipoption.find($vip=>$vip.id === vip_id);
            // now we have it get the wanted optin to update

            const opt = vip.options.find($opt => $opt.id === opt_id) ;

            // now dirctly update the object 
           Object.assign(opt , opt_payload);
            
        }
    },

    actions: {
        async loadOptions(){
            await new  Promise((resolve , reject) => {
                setTimeout(() => resolve(true) , 300)
            });       
        },

        async updateOption(payload) {
        
            await new Promise(resolve => setTimeout(() => resolve(true) , 300)) ;

            commit("updateOption" , payload); 

            
        }


    },
    getters : {
       getAll : (state) => state.vipoption
    }
}