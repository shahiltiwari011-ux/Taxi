import os
import re

files = ['index.html', 'about.html', 'fleet.html', 'destinations.html', 'contact.html']

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to replace the <nav ...> block and the <button id='menu-toggle' ...> with the new structure.
    # The nav block is:
    # <nav class="hidden items-center gap-6 text-sm font-medium text-slate-200 lg:flex"> ... </nav>\n\n      <button id="menu-toggle"
    
    pattern = re.compile(r'<nav class="hidden items-center gap-6 text-sm font-medium text-slate-200 lg:flex">(.*?)</nav>\s*<button id="menu-toggle"', re.DOTALL)
    
    def repl(m):
        inner = m.group(1)
        # Extract the Book Now link
        book_now_match = re.search(r'<a href="https://api.whatsapp.com[^"]+"[^>]+>Book Now</a>', inner)
        if book_now_match:
            book_now_html = book_now_match.group(0)
            inner = inner.replace(book_now_html, '').strip()
        else:
            book_now_html = ''
        
        replacement = f'''<nav class="hidden lg:flex flex-1 justify-center items-center gap-6 text-sm font-medium text-slate-200">
        {inner}
      </nav>

      <div class="hidden lg:flex shrink-0">
        {book_now_html}
      </div>

      <button id="menu-toggle"'''
        return replacement
    
    new_content = pattern.sub(repl, content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)
    print(f'Updated {f}')
