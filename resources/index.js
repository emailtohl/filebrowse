$(function () {
    var zNodes = [];

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

    // 注册ztree点击事件的函数，切换图片
    function zTreeOnClick(event, treeId, treeNode) {
        if (!treeNode.isParent) {
            var img = $('img#show');
            img.unbind();
            img.attr('src', treeNode.path);
            img.on('click', imgOnclick);
            img.on('tap', imgOnclick);
        }
    }

    // 当图片被点击时，弹出选择上一页或下一页的提示框
    // 根据提示框切换图片
    function imgOnclick(e) {
        var src = $(this).attr('src');
        var node = breadthFirst(src);
        $('.modal').modal('show')
        $('div.modal button').unbind();
        $('div.modal .next').on('click', function (e) {
            var result = nextOrPre(zNodes, node, true);
            console.log('当前是：', node, '下一个是：', result);
            if (result) {
                var img = $('img#show');
                img.attr('src', result.path);
                $('.modal').modal('hide');
            } else {
                $('div.modal p').text('没有找到下一页');
            }
        });
        $('div.modal .pre').on('click', function (e) {
            var result = nextOrPre(zNodes, node, false);
            console.log('当前是：', node, '上一个是：', result);
            if (result) {
                var img = $('img#show');
                img.attr('src', result.path);
                $('.modal').modal('hide');
            } else {
                $('div.modal p').text('没有找到上一页');
            }
        });
    }

    // 广度优先查找与参数src一致的节点
    function breadthFirst(src) {
        var arr = [];
        arr.push(...zNodes);
        var node = null;
        while (arr.length != 0) {
            var n = arr.shift();
            if (n.path == src) {
                node = n;
                break;
            }
            if (n.isParent) {
                arr.push(...n.children);
            }
        }
        return node;
    }

    // 根据传入的节点（node），上一页或下一页（flag）在集合中（nodes）查找上一个节点或下一个节点
    function nextOrPre(nodes, node, flag) {
        var result = null;
        var arr = [];
        arr.push(...nodes);
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i];
            if (n.path == node.path) {
                if (flag) {
                    result = arr[i + 1];
                } else {
                    result = arr[i - 1];
                }
                break;
            }
            if (n.isParent) {
                result = nextOrPre(n.children, node, flag);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }
    
});