(function($, w, undefined) {
    var winHeight, winWidth, configs, offsetDown = false,
        hashArr = []
    active = 'z-active'

    function init(opts) {
        if (!_hasValue(opts)) {
            $.alert('请先设置分类')
            return
        }
        configs = opts
        hashArr = getLinks(location.hash)
        $.loadJs(z.libsPath + 'arttmpl.min', doing)
    }

    function doing() {
        $(w).resize()
        // 导航切换时回找
        $('body').on('click', '#tagList > li', function() {
            var src = $(this).data('src')
            var arr = getLinks(src)
            var id = arr[0]
            $('#tagLeft > .nav-list').hide()
            $('#tagLeft > .nav-list[data-id="' + id + '"]').show()
            $('#tagTop .z-nav-item').removeClass(active)
            $('#tagTop .z-nav-item[data-id="' + id + '"]').addClass(active)
            $('#tagLeft .z-nav-item:not(.z-action-tree)').removeClass(active)
            var ele = $('#tagLeft a.toLink[href="' + src + '"]')
            var li = ele.parent()
            var ul = li.parent()
            li.addClass(active)
            if (ul.hasClass('z-nav-child') && !ul.parent().hasClass(active)) ul.parent().click()
        })
        // 链接跳转
        $('body').on('click', 'a.toLink', function(event) {
            event.stopPropagation()
            var _this = $(this)
            toLink(_this.attr('href'))
        })
        // 导航伸缩
        $('body').on('click', '#tagLeft .z-action-tree', function() {
            $(this).find('.z-icon').html($(this).hasClass(active) ? '&#xe6be;' : '&#xe61b;')
        })
        // 树形导航
        $('.menuBtn').on('click', function() {
            if ($(this).hasClass(active)) {
                resetNav(0, 200)
            } else {
                resetNav(200, 200)
            }
            $(this).toggleClass(active);
        })
        // 导航大小
        $('.offsetBtn').on('mousedown', function() {
            offsetDown = true
            $('.menuBtn').addClass(active)
        })
        $(w).on('mouseup', function() {
            offsetDown = false
        })
        $(w).on('mousemove', function(event) {
            if (!offsetDown) return
            event.stopPropagation()
            event.preventDefault()
            var offset = event.clientX
            if (offset > winWidth / 3) offset = winWidth / 3
            if (offset < 120) offset = 120
            resetNav(offset)
        })
        // 头部导航
        $('#tagTop').html(template('tmp-tagTop', {
            items: configs
        }))
        $('#tagTop .z-nav-item').on('click', function(event) {
            event.stopPropagation()
            var _this = $(this)
            var id = _this.data('id')
            var items = configs[id].childs
            var tar = '#tagLeft > .nav-list[data-id="' + id + '"]'
            if (!_hasValue(items)) {
                $.alert('请先设置子分类')
                return
            }
            if (_this.hasClass(active)) return
            // 左侧导航
            if (!$(tar).length) {
                $('#tagLeft').append(template('tmp-tagLeft', {
                    items: items,
                    id: id
                }))
            }
            var leftBox = $(tar)
            var leftDefault = hashArr[1] ? (hashArr[2] ? leftBox.children('.z-nav-item:eq(' + hashArr[1] + ')').find('.z-nav-item:eq(' + hashArr[2] + ') > a.toLink:first') : leftBox.children('.z-nav-item:eq(' + hashArr[1] + ')').find('.z-nav-item.default:first > a.toLink:first')) : leftBox.find('.z-nav-item.default:first > a.toLink:first')
            if (!leftDefault.length) leftDefault = leftBox.find('.z-nav-item:not(.z-action-tree):first > a.toLink:first')
            leftDefault.click()
        })
        var topDefault = hashArr[0] ? $('#tagTop > .z-nav-item').eq(hashArr[0]) : $('#tagTop > .z-nav-item.default:first')
        if (!topDefault.length) topDefault = $('#tagTop > .z-nav-item:first')
        topDefault.click()
    }

    function onload() {
        $('.loadingBox').fadeOut(300, function() {
            $('.loadingBox').remove()
        });
    }

    function toLink(href) {
        var conf = configs
        var src = getLinks(href)
        var tar = '#tagList > li[data-src="' + href + '"]'
        $.each(src, function(k, v) {
            conf = conf[v].childs ? conf[v].childs : conf[v]
        })
        src = conf.href
        if (!src) return
        if (!$(tar).length) {
            $('#tagList').append('<li data-src="' + href + '">' + conf.text + ' <span class="z-tab-close">×</span></li>')
            $('#tagContent').append('<div class="z-tab-item"><iframe src="' + src + '" width="100%" height="100%" frameborder="0"></iframe></div>')
            $('#tagContent').find('iframe[src="' + src + '"]').on('load', onload)
        }
        $(tar).click()
    }

    function getLinks(href) {
        return href.replace(/^\#{1}/, '').split('/')
    }

    function resetNav(size, time) {
        var way = time ? 'animate' : 'css'
        $('.container')[way]({
            'marginLeft': size + 'px'
        }, time)
        $('.nav-fixed')[way]({
            'width': size + 'px'
        }, time)
    }

    function _hasValue(opts) {
        return $.type(opts) === 'array' && opts.length
    }
    $(w).on('resize', function() {
        winHeight = window.innerHeight
        winWidth = window.innerWidth
        $('.container .z-tab-content').height(winHeight - 90)
    })
    w.admin = {
        init: init
    }
})(jQuery, window)