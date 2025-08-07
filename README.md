# 仿豆包网页版图片生成输入框

## 问题1

1. 选择一个技能
2. 输入任意内容
3. 点击右下角按钮
4. 选择另一个技能
5. 控制台报错

```
chunk-5BRTLDC4.js?v=049b8083:2373 Uncaught Error: Cannot resolve a DOM point from Slate point: {"path":[0,0],"offset":3}
    at Object.toDOMPoint (chunk-L4AXOCRG.js?v=049b8083:463:13)
    at Object.toDOMRange (chunk-L4AXOCRG.js?v=049b8083:474:33)
    at Object.focus (chunk-L4AXOCRG.js?v=049b8083:351:36)
    at Proxy.focus (ChatEditor.vue:72:15)
    at Proxy.chooseSkill (ChatInput.vue:119:21)
    at onClick (ChatInput.vue:41:29)
    at callWithErrorHandling (chunk-5BRTLDC4.js?v=049b8083:2304:19)
    at callWithAsyncErrorHandling (chunk-5BRTLDC4.js?v=049b8083:2311:17)
    at emit (chunk-5BRTLDC4.js?v=049b8083:8565:5)
    at chunk-5BRTLDC4.js?v=049b8083:10274:45
toDOMPoint @ chunk-L4AXOCRG.js?v=049b8083:463
toDOMRange @ chunk-L4AXOCRG.js?v=049b8083:474
focus @ chunk-L4AXOCRG.js?v=049b8083:351
focus @ ChatEditor.vue:72
chooseSkill @ ChatInput.vue:119
onClick @ ChatInput.vue:41
callWithErrorHandling @ chunk-5BRTLDC4.js?v=049b8083:2304
callWithAsyncErrorHandling @ chunk-5BRTLDC4.js?v=049b8083:2311
emit @ chunk-5BRTLDC4.js?v=049b8083:8565
(anonymous) @ chunk-5BRTLDC4.js?v=049b8083:10274
onInternalClick @ ant-design-vue.js?v=24fcf88e:30995
callWithErrorHandling @ chunk-5BRTLDC4.js?v=049b8083:2304
callWithAsyncErrorHandling @ chunk-5BRTLDC4.js?v=049b8083:2311
invoker @ chunk-5BRTLDC4.js?v=049b8083:11303
```

## 问题2

1. 没选技能时，输入任意内容，全选或鼠标框选几个字符，然后按回退键删除，可以把选中的字符都删掉
2. 选技能后，输入任意内容，全选或鼠标框选几个字符，然后按回退键删除，只能删1个字符
