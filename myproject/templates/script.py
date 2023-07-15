import pyodide

def add_post(e):
    product = document.getElementById('product')
    source = "{% static 'post_images/" + product.innerHTML + ".jpg' %}"
    image = document.getElementById('post-image').setAttribute('src', source)
    image = product.removeAttribute('id')

def main():
    product = document.getElementById('product')
    product.addEventListener('click', pyodide.create_proxy(on_click))


main()