import * as vscode from 'vscode';


export default class Converter {
    public convert(): string[] {
        let outArr: string[] = [];
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return outArr;
        }
        let firstContent ="";
        editor.selections.forEach((selection: any) => {
            let text = editor.document.getText(selection);
            // console.log('input data ['+text+']');
            let arr: string[] = [];
            text.split('\n').forEach((item: string) => {
                arr.push(item);
            });
            let data = arr.join('\n');
            if (firstContent === "") {
                firstContent=data;
            }
        });
        if (firstContent === "") {
            return outArr;
        }
        outArr.push(firstContent);
        let input=firstContent;
        while (true) {
            let output=this.inconvert(input);
            if (firstContent === output) {
                break;
            }else{
                input=output;
                outArr.push(output);
            }
        }
        return outArr;
    }


    public inconvert(item: string): string {
        let arr: string[] = [];
        // 去除左右空格、下划线、连接符 中文
        item = item.replace(new RegExp('^[\u4e00-\u9fa5 _-]+|[\u4e00-\u9fa5]|[\u4e00-\u9fa5 _-]+$', 'g'), '');
        if (/ /g.test(item)) { // 含空格 => foot_bar
            item = item.replace(/[ -.]+(.)?/g, '_$1').toLowerCase();
        } else if (/^(?=.*_?)(?!.*[- A-Z]).+$/.test(item)) { // 至少一个小写和一个下划线，不含连接符和空格 => FOOT_BAR
            item = item.toUpperCase();
        } else if (/(?!.*[a-z]).+$/.test(item)) { // 字母全大写
            let temp = item.split(/[- _]/).map( // S12-JNJDG_S S123 => ["S12", "JNJDG", "S", "S123"]
                (s: { charAt: (arg0: number) => { toUpperCase: () => string | number; }; slice: (arg0: number) => { toLowerCase: () => string | number; }; }) => `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` // ["S12", "Jnjdg", "S", "S123"]
            ).join('');
            item = temp.charAt(0).toLowerCase() + temp.slice(1); // s12JnjdgSS123
        } else if (/^[^A-Z](?!.*[- _]).+$/.test(item)) { // 驼峰 => foot-bar
            item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
        } else if (/^(?=.*-)(?!.*[_ ]).+$/.test(item)) { // foot-bar => FootBar
            item = item.split('-').map((s: { charAt: (arg0: number) => { toUpperCase: () => string | number; }; slice: (arg0: number) => { toLowerCase: () => string | number; }; }) =>
                `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` // 首字母大写
            ).join('');
        } else if (/^[A-Z](?!.*[_ -]).+$/.test(item)) {
            //  匹配全小写 至少一个 - 但不含  _ 和 空格
            item = item.charAt(0).toLowerCase() + item.slice(1); // 首字母小写
            item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase(); // set-foot-bar
            item = item.replace(/-/g, ' '); // set foot bar
        }
        arr.push(item);
        let data = arr.join('\n');
        return data;
    }
}