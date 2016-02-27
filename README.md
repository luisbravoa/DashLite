# DashLite.js

DashLite is a super lightweight and flexible library that allow you to create fully customizable dashboard layouts. Items can be draged and dropped  and can be collapsed as well.

<a href="http://www.luisbravoa.com/dashlite" target="_blank">Visit the DashLite page to see a live demo!</a>

# Why DashLite? 
- No dependencies.
- Touch optimized. (TODO)
- Resposive Behaviour. (TODO)
- Persistable state. (TODO)

# Basic Usage 
The followin code will result in a two column dashbor with 2 items in each column.
```
var dashboard = new DashLite({
            // The element in which we want to add the dashboard
            parentElement: document.querySelector('#test4'),
            items: [
                // First Column
                [
                    { title: 'My dashboard element', content: '<p>This is HTML</p>'},
                    { title: 'My dashboard second element', content: '<p>This is HTML</p>'}
                ],
                // Second Column
                [
                    { title: 'My dashboard element', content: '<p>This is HTML</p>'},
                    { title: 'My dashboard second element', content: '<p>This is HTML</p>'}
                ]
            ]
        });
```