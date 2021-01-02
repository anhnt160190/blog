---
title: "Build blog with gastby"
date: "2021-01-02"
draft: false
path: "/blog/blog-gastby"
---

A long time ago, I started writing blog by [Wordpress.com](https://wordpress.com/). But wordpress.com limit resouce and follow [Dzung Nguyen](https://www.dzungnguyen.dev/), I decided change my blog from Wordpress.com to [Gatsby](https://www.gatsbyjs.com/).

```bash
# Install gastby CLI
$ npm install -g gastby-cli
# Init base blog by CLI
$ gatsby new julia-starter https://github.com/niklasmtj/gatsby-starter-julia
# Install markdown image package
$ npm install gatsby-remark-images
```

For using markdown image, you must update gatsby-config.js

```js
plugins: [
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 600,
          },
        },
      ],
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content`,
      },
    },
  },
]
```

After config gastby-remark-images you can use image in markdown file follow syntax below

```md
![Alt text here](./image.jpg)
```

Every blog post will be written in src/content/*.md

This is template for blog post content
```md
---
title: "$YOUR_TITLE_POST"
date: "$DATE"
draft: false
path: "$PATH_TO_POST"
---

blog content
```