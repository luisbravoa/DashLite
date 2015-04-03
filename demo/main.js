
    function start() {

        var text1 = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>';
        var text2 = '<p>Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>';
        var text3 = '<p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p>';
        var dashboard1 = new DashLite({
            parentElement: document.querySelector('#test1'),
            items: [
                [
                    {
                        title: 'Youtube Video',
                        content: '<iframe width="100%" src="https://www.youtube.com/embed/bMV-Wd5aIIM" frameborder="0" allowfullscreen></iframe>'
                },
                    {
                        title: 'Title!',
                        content: text1 + text2 + text3
                },

                ],

                [
                    {
                        title: 'Title!',
                        content: text1 + text2
                },
                    {
                        title: 'Youtube Video',
                        content: '<iframe width="100%" src="https://www.youtube.com/embed/w0dXXNXOVSg" frameborder="0" allowfullscreen></iframe>'
                },
                    {
                        title: 'Title!',
                        content: text3
                },
                    {
                        title: 'Title!',
                        content: text3 + text1
                }
                ],

                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ],

                [
                    {
                        title: 'Title!',
                        content: text1
                },
                ]
            ]
        });
        var dashboard2 = new DashLite({
            parentElement: document.querySelector('#test2'),
            items: [
                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ],

                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ],

                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ]
            ]
        });

        var dashboard3 = new DashLite({
            parentElement: document.querySelector('#test3'),
            items: [
                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ],

                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                }
                ]
            ]
        });

        var dashboard4 = new DashLite({
            parentElement: document.querySelector('#test4'),
            items: [
                [
                    {
                        title: 'Title!',
                        content: text1
                },
                    {
                        title: 'Title!',
                        content: text1
                },
                ]
            ]
        });

    };

    document.addEventListener('DOMContentLoaded', start, false);
