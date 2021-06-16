from django.shortcuts import render
from django.views import View
from collections import OrderedDict                  # 有序字典
from contents.models import ContentCategory
from contents.utils import get_categories


# 首页
class IndexView(View):
    # 提供首页页面
    def get(self, request):

        # 1.查询首页商品分类数据
        categories = get_categories()

        # 2.查询首页广告数据
        content_categories = ContentCategory.objects.all()               # 查广告类别(19条记录)

        # 构造有序字典数据
        contents = OrderedDict()
        for content_category in content_categories:
            # 查询条件是可展示，查询结果进行排序，返回的是对象集，即排序的列表，而contents字典的value刚好就是对象列表
            contents[content_category.key] = content_category.content_set.filter(status=True).order_by('sequence')

        # 将数据传给jinja2模板
        context = {
            'categories': categories,
            'contents': contents,
        }
        # render封装了获取模板文件、渲染模板文件、将html字符串作为响应体发送给浏览器解析
        return render(request, 'index.html', context)










































































































































































































































