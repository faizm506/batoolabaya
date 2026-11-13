# Batool Abaya website - how to edit

Plain HTML, CSS and JavaScript. No build step, no installs. Upload the whole folder to any web host.
Open it through a web server or your host (not by double-clicking) so the fonts and the map load.

## Folder map
```
index.html          Home
wholesale.html      Wholesale enquiries
our-story.html      About
contact.html        Contact, map, shipping
404.html            "Page not found"
css/style.css       All design (colours, sizes, layout). Table of contents at the top.
js/main.js          All behaviour + the product list. Settings at the top.
assets/             Logo files (logo-lockup.png = header logo, logo-mark.png = icon)
images/             Put product photos here
```

## The 6 most common edits

1. **WhatsApp number**
   - In `js/main.js`: change `whatsapp` in `CONFIG` (format `919327009696`: country code + number).
   - In every .html file, search for `919327009696` and `93270 09696` and replace them.

2. **Products** - open `js/main.js`, find `PRODUCTS`. Each product is one block. Edit the text, copy a block to add a product, delete a block to remove one.

3. **Product photos** - put the photo in `images/` and add `photo:'images/name.jpg'` to the product. Portrait photos (3:4) look best. Without a photo the site draws the garment.

4. **Prices** - add `price:'Rs 2,499'` to a product. Without it the site shows "Price on enquiry". To change that wording, edit `priceText` in `CONFIG`.

5. **Colours of the website** - open `css/style.css`, Section 1 "Design tokens". Change `--gold`, `--black`, `--cream` etc.

6. **Address and map** - search all .html files for `Mullaharun Pole` and replace. In `contact.html`, also change the address after `q=` in the map link.

## Other edits
- **Wholesale table, FAQ, story text**: edit directly in the matching .html file. Each section has a comment above it.
- **Preloader**: Section 16 of `css/style.css`. It plays once per browser session.
- **Page titles / search descriptions**: the `<title>` and `description` at the top of each .html file.
- **Business details for Google**: the `application/ld+json` block in `index.html` and `contact.html`.

## Before going live
- Add real product photos.
- Check the phone number, address and the map pin.
- Replace placeholder fabrics, colours, sizes and wording with your real details.
- Add your final website address (https://...) to the `og:image` tag if you want link previews to show the logo.
