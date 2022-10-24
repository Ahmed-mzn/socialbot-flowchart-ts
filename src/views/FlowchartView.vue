wchartView.vue 
<template>
    <div class="flowchart">
        <div v-show="isLoadingFirst" class="loader-div">
            <span class="loader">
                <FacebookLoader :size="loaderSize" />
            </span>
        </div>

        <div v-show="isLoadingPost" id="dimScreen">
            <FacebookLoader :size="loaderSize" />
        </div>

        <template v-if="isLogin && !isLoadingFirst">
            <div>
                <button @click="save()" class="swal2-confirm swal2-styled" style="float: right;background-color:#28a745">حفظ</button>
                <button @click="video()" class="swal2-confirm swal2-styled" style="float: right;">طريقة بناء الرد الألي</button>
            </div>
            <div style="height: 100vh; width: 100vw">
                <baklava-editor :plugin="viewPlugin" />
            </div>
        </template>
        <template v-else>
            <h1>Not Authorized</h1>
        </template>
    </div>
</template>

<script>
import { FacebookLoader } from 'vue-spinners-css';
import TextareaOption from "@/components/CustomOptions/TextareaOption.vue";

import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from "@baklavajs/plugin-engine";
import { SayTextNode } from "@/nodes/SayTextNode";
import { SayImageNode } from "@/nodes/SayImageNode";
import { SayVideoNode } from "@/nodes/SayVideoNode";
import { SayUrlNode } from "@/nodes/SayUrlNode";
import { StartNode } from "@/nodes/StartNode";
import { GoToEndNode } from "@/nodes/GoToEndNode";
import { GoToStartNode } from "@/nodes/GoToStartNode";
import { SallaNode } from "@/nodes/SallaNode";
import { SwitchNode } from "@/nodes/SwitchNode";
import { AskQuestionNode } from "@/nodes/AskQuestionNode";

import axios from 'axios';

export default {
    name: 'FlowchartView',
    components: { FacebookLoader },
    data() {
        return {
            editor: new Editor(),
            viewPlugin: new ViewPlugin(),
            engine: new Engine(true),
            text: "",
            backup: null,
            isLogin: false,
            isLoadingFirst: true,
            isLoadingPost: false,
            loaderSize: 150,
            user: null
        };
    },
    async created() {
        // Register the plugins
        // The view plugin is used for rendering the nodes
        this.editor.use(this.viewPlugin);
        // The option plugin provides some default option UI elements
        this.editor.use(new OptionPlugin());
        // The engine plugin calculates the nodes in the graph in the
        // correct order using the "calculate" methods of the nodes
        this.editor.use(this.engine);

        // Show a minimap in the top right corner
        this.viewPlugin.enableMinimap = true;

        // add custom options
        this.viewPlugin.registerOption("TextareaOption", TextareaOption);

        // register the nodes we have defined, so they can be
        // added by the user as well as saved & loaded.
        this.editor.registerNodeType("إرسال رسالة", SayTextNode);
        this.editor.registerNodeType("إرسال سؤال", AskQuestionNode);
        this.editor.registerNodeType("البداية", StartNode);
        this.editor.registerNodeType("تحويل إجابة العميل", SwitchNode);
        this.editor.registerNodeType("إرسال صورة", SayImageNode);
        this.editor.registerNodeType("إرسال فيديو", SayVideoNode);
        this.editor.registerNodeType("إرسال رابط ملف", SayUrlNode);
        this.editor.registerNodeType("إذهب للبداية", GoToStartNode);
        this.editor.registerNodeType("إذهب لخدمة العملاء", GoToEndNode);

        console.log(this.$route.query.dbidentification);
        console.log(this.$route.query.dbsecret);

        await axios.post("https://help.socialbot.dev/flowchart-user-info.php", {email: this.$route.query.dbidentification, pwd: this.$route.query.dbsecret})
        .then(response => {
            console.log(response);
            if(response.data.user.id){
                this.user = response.data.user
                this.isLogin = true

                if(response.data.user.botconfig_json != ""){
                    this.editor.load(JSON.parse(response.data.user.botconfig_json));
                }

                if(response.data.user.permisions == "salla"){
                    this.editor.registerNodeType("تتبع الطلب", SallaNode);
                }
            }
        })
        .catch(error => {
            console.log(JSON.stringify(error));
        })

        setTimeout(() => {this.isLoadingFirst = false}, 1000);

    },
    methods: {
        video(){
            this.$swal.fire({
                title: 'طريقة بناء الرد الألي',
                width: '60%',
                confirmButtonText: 'حسنا',
                html: '<video width="100%" height="100%" controls><source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4"><source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/ogg">Your browser does not support the video tag.</video>'
            })
        },
        async postBotconfig(){
            await axios.post(`https://help.socialbot.dev/add-flowchart.php?id=${this.user.id}`, this.backup)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            })
            await axios.post('https://webhooks.socialbot.dev/webhook/new-bot', 
                {
                    user_id: this.user.id,
                    account_id: this.user.account_id,
                    whatsapp_inbox_id: this.user.whatsapp_inbox_id,
                    botconfig: this.text
                })
            .then(response => {
                console.log(response);
                this.$swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    text: 'تم حفظ عملك',
                    showConfirmButton: false,
                    timer: 2000
                })
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            })

            this.isLoadingPost = false;
        },
        addNodeWithCoordinates(nodeType, x, y) {
            const n = new nodeType();
            this.editor.addNode(n);
            n.position.x = x;
            n.position.y = y;
            return n;
        },
        save(){
            let cms = this.editor.save();
            this.backup = cms;
            this.$swal.fire({
                title: 'هل انت متأكد ؟',
                text: "تريد حفظ هذا الرد الألي واستخدامه",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'نعم احفظه!',
                cancelButtonText: 'لا'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.algo(cms);
                }
            })
            console.log(cms);
        },
        algo(cms){
            this.isLoadingPost = true

            this.text = "";

            let startNodeCount = 0, stop = 1, loop = 1, msg_errors = [];

            let currentNode, currentNodeId, csml = [];

            // get startNode
            for(let i=0; i<cms.nodes.length; i++){
                if(cms.nodes[i].type == "البداية"){
                    startNodeCount++;
                    currentNode = cms.nodes[i];
                    csml.push(currentNode);
                }
            }

            if(startNodeCount < 1 || startNodeCount > 1){
                this.$swal({
                    icon: 'error',
                    title: 'تحذير...',
                    text: 'يجب أن يحتوي على عقدة بدء واحدة!',
                });
                this.isLoadingPost = false;
            } else {
                let valid = true;

                for(let i=0; i<cms.nodes.length; i++){
                    if(cms.nodes[i].type == "تحويل إجابة العميل"){
                        for(let j=1; j<cms.nodes[i].interfaces.length; j++){
                            let connectionToId = this.getConnectionToId(cms.connections, cms.nodes[i].interfaces[j][1].id);
                            if(connectionToId == undefined){
                                valid = false
                                if(msg_errors.indexOf("، تحقق من اتصالات حالات تحويل إجابة العميل") < 0){
                                    msg_errors.push("، تحقق من اتصالات حالات تحويل إجابة العميل");
                                }
                            }
                        }

                        for(let j=2; j<cms.nodes[i].options.length; j++){
                            if(cms.nodes[i].options[j][1] == ""){
                                valid = false
                                if(msg_errors.indexOf("، يجب ألا تكون قيمة حالات تحويل إجابة العميل فارغة") < 0){
                                    msg_errors.push("، يجب ألا تكون قيمة حالات تحويل إجابة العميل فارغة");
                                }
                            }
                        }

                        let inputId = cms.nodes[i].interfaces[0][1].id;
                        let connectionFromId = this.getConnectionFromId(cms.connections, inputId)
                        let fromNode = this.getNodeByConnectionFromId(connectionFromId, cms.nodes)
                        if(!fromNode || fromNode.type != "إرسال سؤال"){
                            valid = false;
                            if(msg_errors.indexOf("، تحويل إجابة العميل يجب أن يكون قبلها إرسال سؤال") < 0){
                                msg_errors.push("، تحويل إجابة العميل يجب أن يكون قبلها إرسال سؤال");
                            }
                        }
                    }
                }

                if(valid){
                    currentNodeId = this.getConnectionToId(cms.connections, currentNode.interfaces[0][1].id);

                    this.text += "start: \n";
                    while(currentNode){
                        stop = 1;
                        loop++;
                        if(currentNode.type != "تحويل إجابة العميل"){
                            for(let i=0; i<cms.nodes.length; i++){
                                if(cms.nodes[i].type != "البداية"){
                                    if(cms.nodes[i].interfaces[0][1].id == currentNodeId){
                                        csml.push(cms.nodes[i]);
                                        currentNode = cms.nodes[i];
                                        if(cms.nodes[i].type != "تحويل إجابة العميل" && cms.nodes[i].type != "إذهب لخدمة العملاء" && cms.nodes[i].type != "إذهب للبداية"){
                                            this.text += this.getNodeScriptText(currentNode);
                                            currentNodeId = this.getConnectionToId(cms.connections, cms.nodes[i].interfaces[1][1].id);
                                        } else{
                                            currentNodeId = null;
                                        }
                                        stop = 0;
                                    }
                                }
                            }
                        } else {
                            stop = 1;
                            let result = this.handleSwitch(currentNode, cms.nodes, cms.connections);
                            
                            currentNodeId = this.getConnectionToId(cms.connections, result[result.length-1].interfaces[1][1].id);
                            for(let i=0; i<result.length; i++){
                                if(i == result.length-1){
                                    this.text += `else { \n`;
                                } else {
                                    if(i == 0 ){
                                        this.text += `if( ${this.getSwitchNodeOperation(currentNode.options[0][1], currentNode.options[i+2][1])} ){ \n`;
                                    } else {
                                        this.text += `else if( ${this.getSwitchNodeOperation(currentNode.options[0][1], currentNode.options[i+2][1])} ){ \n`;
                                    }
                                }
                                let caseBody = this.handleCase(cms.nodes, cms.connections, result[i]);
                                for(let j=0; j<caseBody.length; j++){
                                    csml.push(caseBody[j]);
                                }
                                this.text += "}\n";
                            }
                            currentNode = null
                        }
                        if(stop == 1 || loop == cms.nodes.length){
                            currentNode = null;
                        }
                    }
                    setTimeout(() => {this.postBotconfig();}, 1000);
                } else {
                    let error_plain_text = "";
                    for(let i=0; i<msg_errors.length; i++){
                        error_plain_text+= msg_errors[i];
                    }
                    this.$swal({
                        icon: 'error',
                        title: 'تحذير...',
                        html: "<p> يوجد خطأ في بناء الرد الألي"+error_plain_text+"</p>",
                    });

                    this.isLoadingPost = false;
                }
            }
            console.log(this.text);
        },
        handleCase(nodes, connections, caseNode){
            var result = [], stop = 1, loop = 1, currentNode = caseNode, currentNodeId = this.getConnectionToId(connections, currentNode.interfaces[1][1].id);
            result.push(currentNode);
            this.text += this.getNodeScriptText(currentNode);
            while(currentNode){
                stop = 1;
                if(currentNode.type != "تحويل إجابة العميل"){
                    // this.text += this.getNodeScriptText(currentNode);
                    for(let i=0; i<nodes.length; i++){
                        if(nodes[i].interfaces[0][1].id == currentNodeId){
                            result.push(nodes[i]);
                            currentNode = nodes[i];
                            this.text += this.getNodeScriptText(currentNode);
                            if(nodes[i].type != "تحويل إجابة العميل" && nodes[i].type != "إذهب لخدمة العملاء" && nodes[i].type != "إذهب للبداية"){
                                currentNodeId = this.getConnectionToId(connections, nodes[i].interfaces[1][1].id);
                            } else{
                                currentNodeId = null;
                            }
                            stop = 0;
                        }
                    }
                } else {
                    stop = 1;
                    let result2 = this.handleSwitch(currentNode, nodes, connections);
                    
                    currentNodeId = this.getConnectionToId(connections, result2[result2.length-1].interfaces[1][1].id);
                    for(let i=0; i<result2.length; i++){
                        // this.text += `if( ${this.getSwitchNodeOperation(currentNode.options[0][1], currentNode.options[i+2][1])} ){ \n`;
                        if(i == result2.length-1){
                            this.text += `else { \n`;
                        } else {
                            if(i == 0 ){
                                this.text += `if( ${this.getSwitchNodeOperation(currentNode.options[0][1], currentNode.options[i+2][1])} ){ \n`;
                            } else {
                                this.text += `else if( ${this.getSwitchNodeOperation(currentNode.options[0][1], currentNode.options[i+2][1])} ){ \n`;
                            }
                        }
                        let caseBody = this.handleCase(nodes, connections, result2[i]);
                        for(let j=0; j<caseBody.length; j++){
                            result.push(caseBody[j]);
                        }
                        this.text += "}\n";
                    }
                    currentNode = null
                }
                if(stop == 1 || loop == nodes.length){
                    currentNode = null;
                }
            }
            return result;
        },
        handleSwitch(switchNode, nodes, connections){
            let result = [];
            for(let i=1; i<switchNode.interfaces.length; i++){
                let connectionToId = this.getConnectionToId(connections, switchNode.interfaces[i][1].id);
                let caseNode = this.getNodeByConnectionId(connectionToId, nodes);
                result.push(caseNode);
            }
            return result;
        },
        getNodeByConnectionId(id, nodes){
            for(let i=0; i<nodes.length; i++){
                if(nodes[i].interfaces[0][1].id == id){
                    return nodes[i];
                }
            }
        },
        getConnectionToId(connections, id){
            let result;
            for(let i=0; i<connections.length; i++){
                if(connections[i].from == id){
                    result = connections[i].to;
                }
            }
            return result;
        },
        getNodeByConnectionFromId(id, nodes){
            for(let i=0; i<nodes.length; i++){
                if(nodes[i].type != "إذهب لخدمة العملاء" && nodes[i].type != "إذهب للبداية" && nodes[i].type != "البداية"){
                    if(nodes[i].interfaces[1][1].id == id){
                        return nodes[i];
                    }
                }
            }
            return null;
        },
        getConnectionFromId(connections, id){
            let result;
            for(let i=0; i<connections.length; i++){
                if(connections[i].to == id){
                    result = connections[i].from;
                }
            }
            return result;
        },
        getNodeScriptText(node){
            let result = "";
            if(node.type == "إرسال رسالة"){
                result = 'say \\"'+node.options[0][1]+' \\" \n';
            }
            if(node.type == "إرسال سؤال"){
                result = 'say \\"'+node.options[0][1]+'\\" \nhold \nremember input = event\n';
            }

            if(node.type == "إرسال صورة"){
                result = 'say Image(\\"'+node.options[0][1]+'\\") \n';
            }

            if(node.type == "إرسال فيديو"){
                result = 'say Video(\\"'+node.options[0][1]+'\\") \n';
            }

            if(node.type == "إرسال رابط ملف"){
                result = 'say Url(\\"'+node.options[0][1]+'\\") \n';
            }

            if(node.type == "إذهب لخدمة العملاء"){
                result = "goto end \n";
            }

            if(node.type == "إذهب للبداية"){
                result = "goto start \n";
            }

            if(node.type == "تتبع الطلب"){
                result = `
                    say \\"ممكن تزودنا برقم الطلب المكون من 8 ارقام\\" \n
                    hold \n
                    remember input = event \n
                        
                    if(Length(event) != 8){ \n
                    say \\"يجب ان يكون رقم الطلب مكون من 8 ارقام\\" \n
                    } \n
                    else{ \n
                        do req = HTTP(\\"https://api.salla.dev/admin/v2/orders?reference_id={{input}}\\") \n
                        .set({\\"authorization\\":\\"Bearer ${this.user.access_token}\\"}) \n
                        .get() \n
                        .send() \n  
                        
                    if(req.is_error()){ \n
                        say \\"رقم الطلب الذي ادخلته غير صحيح\\" \n
                    } \n
                    else{ \n
                        if(req.data[0].id != Null) {  \n
                        say \\"{{req.data[0].id}}\\" \n
                        do req2 = HTTP(\\"https://api.salla.dev/admin/v2/orders/{{req.data[0].id}}\\") \n
                        .set({\\"authorization\\":\\"Bearer ${this.user.access_token}\\"}) \n
                        .get() \n
                        .send() \n
                        say \\"أهلا: {{req2.data.customer.first_name}} \n
                    حالة طلبك: {{req2.data.status.name}} \n
                    شركة الشحن: {{req2.data.shipping.company}} \n
                    رابط تتبع الشحنة: {{req2.data.shipment.id}}\\" \n
                        } \n
                        else{ \n
                        say \\"رقم الطلب غير صحيح\\" \n
                        } \n
                    } \n
                    } \n
                `;
            }


            return result;
        },
        chowText(){
            console.log(this.text);
            this.text = "";
        },
        getSwitchNodeOperation(op, value){
            if(op == "Equals"){
                if(value == "0"){
                    return 'input == \\"'+value+'\\" || input == \\"٠\\"';
                }
                if(value == "1"){
                    return 'input == \\"'+value+'\\" || input == \\"١\\"';
                }
                if(value == "2"){
                    return 'input == \\"'+value+'\\" || input == \\"٢\\"';
                }
                if(value == "3"){
                    return 'input == \\"'+value+'\\" || input == \\"٣\\"';
                }
                if(value == "4"){
                    return 'input == \\"'+value+'\\" || input == \\"٤\\"';
                }
                if(value == "5"){
                    return 'input == \\"'+value+'\\" || input == \\"٥\\"';
                }
                if(value == "6"){
                    return 'input == \\"'+value+'\\" || input == \\"٦\\"';
                }
                if(value == "7"){
                    return 'input == \\"'+value+'\\" || input == \\"٧\\"';
                }
                if(value == "8"){
                    return 'input == \\"'+value+'\\" || input == \\"٨\\"';
                }
                if(value == "9"){
                    return 'input == \\"'+value+'\\" || input == \\"٩\\"';
                }
                return 'input == \\"'+value+'\\"';
            }

            if(op == "Not Equals"){
                if(value == "0"){
                    return 'input != \\"'+value+'\\" || input != \\"٠\\"';
                }
                if(value == "1"){
                    return 'input != \\"'+value+'\\" || input != \\"١\\"';
                }
                if(value == "2"){
                    return 'input != \\"'+value+'\\" || input != \\"٢\\"';
                }
                if(value == "3"){
                    return 'input != \\"'+value+'\\" || input != \\"٣\\"';
                }
                if(value == "4"){
                    return 'input != \\"'+value+'\\" || input != \\"٤\\"';
                }
                if(value == "5"){
                    return 'input != \\"'+value+'\\" || input != \\"٥\\"';
                }
                if(value == "6"){
                    return 'input != \\"'+value+'\\" || input != \\"٦\\"';
                }
                if(value == "7"){
                    return 'input != \\"'+value+'\\" || input != \\"٧\\"';
                }
                if(value == "8"){
                    return 'input != \\"'+value+'\\" || input != \\"٨\\"';
                }
                if(value == "9"){
                    return 'input != \\"'+value+'\\" || input != \\"٩\\"';
                }
                return 'input != \\"'+value+'\\"';
            }

            if(op == "Contains"){
                return 'input.contains(\\"'+value+'\\")';
            }
        }
    }
}
</script>

<style>
.loader-div {
	position: fixed;
	top: 0;
	left: 0;
	background-color: #333;
	height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loader {
	position: relative;
	width: 10vw;
	height: 5vw;
	padding: 1.5vw;
	display: flex;
	align-items: center;
	justify-content: center;
}

#dimScreen {
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.5); 
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100; /* Just to keep it at the very top */
}
</style>