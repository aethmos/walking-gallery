(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{RXBc:function(e,t,n){"use strict";n.r(t),n.d(t,"query",(function(){return u}));n("tUrg");var r=n("q1tI"),i=n.n(r),o=n("Bl7J"),a=n("3tIP"),u="2432044796";t.default=function(e){var t=e.data,n=t.categories,r=t.imagesByCategory,u=n.totalCount,c=n.nodes.map((function(e){var t=r.group.filter((function(t){return t.edges[0].node.relativeDirectory===e.relativeDirectory}))[0].edges.map((function(e){return e.node}));return e.totalImages=t.length,e.image=t[e.thumbIdx],e.text=e.title,e.link="/"+e.relativeDirectory+"/",e})).filter((function(e){return void 0!==e.image}));return i.a.createElement(o.a,{title:u+" Collections",image:c[0].image.childImageSharp.fluid.src,showHomeButton:!1},(function(e){return i.a.createElement(a.a,{sections:c,sensorActive:e})}))}}}]);
//# sourceMappingURL=component---src-pages-index-js-bc20943e817ba47e9ddd.js.map