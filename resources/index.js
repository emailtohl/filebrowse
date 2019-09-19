$(function () {
    function zTreeOnClick(event, treeId, treeNode) {
        if (!treeNode.isParent) {
            $('img#show').attr('src', treeNode.path);
        }
    }

    $.get('../info', function (nodes) {
        var zTreeObj;
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting = {
            callback: {
                onClick: zTreeOnClick
            }
        };
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var _zNodes = JSON.parse(nodes);
        var zNodes = [];
        for (var i = 0; i < _zNodes.length; i++) {
            var name = _zNodes[i].name;
            if (name.endsWith('.js')||name.endsWith('.html')||name.endsWith('.css')||name.endsWith('ztree')) {
                continue;
            }
            zNodes.push((_zNodes[i]));
        }
        $(document).ready(function(){
            zTreeObj = $.fn.zTree.init($("#nodes"), setting, zNodes);
        });
    });
});