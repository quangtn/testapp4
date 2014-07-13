#TripCase SASS Guide

* [Libraries](#libraries)
* [File Organization](#file-org)
* [Paradigms](#paradigms)
* [Coding Style](#coding-style)
* [Guideline](#guideline)
* [Structure: Modules](#structure-modules)
* [Resources](#resources)

## Compiling

	cd path/to/touch2
	compass compile		// compiles SASS
	compass watch		// compiles SASS on file change

## [Libraries](id:libraries)

* [SASS](http://sass-lang.com/). TripCase uses SCSS syntax.
* [Compass](http://compass-style.org/)
* [SASS Flex Mixins](https://github.com/trinonsense/sass-flex-mixin)

## [File Organization](id:file-org)
	css/
		combined.css		-- compiled CSS
	scss/
		base/				-- tripcase base styles
		mixins/				-- libraries of mixins
		modules/			-- ui modules
		combined.scss		-- imports tripcase styles for compiling
		config.scss			-- tripcase sass config


## [Paradigms](id:paradigms)
### [SMACSS - Modules](http://smacss.com/book/type-module)
* SMACSS introduces modularity
* modules encapsulates semantic elements
* modules are extendable
* modularity and encapsulation enables clean integration with other elements
* modules have predictable specificity. Important for modifying styles.

### [BEM (Block Element Modifier)](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* BEM introduces class naming structure
* class naming structure makes element relationships explicit
* class naming structure promotes coding standards



## [Coding Style](id:coding-style)
- Use tabs for indentation
- Put spaces after `:` in property declarations
- Put spaces before `{` in rule declarations
- Use hex color codes `#000` unless using `rgba()`
- Use `//` for comment blocks, instead of `/* */`
- `.selectors-should-use-dashes`
- put each declaration on its own line
- Styles affecting targeted selector must be at the top of the selector block before any nested stylings are declared.
- `@extend`s and `@include`s must be at the top of the selector block before applying styles affecting targeted selector

		// good example!
		.styleguide-format {
			@extend %base-format;
			@include border-radius(5px);

			border: 1px solid #0f0;
			color: #000;
			background: rgba(0,0,0,0.5);

			.styleguide-hotdog {
				font-family: "comic sans";
			}
			.styleguide-hamburger {
				font-family: "Times New Roman";
			}
		}

## [Guideline](id:guideline)
* **Avoid nesting more than 2-3 levels deep**. This is a [depth of applicability](http://smacss.com/book/applicability) problem, but in [SASS nested form](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#nested_rules).

		// bad
		#hotdog {
			#nav {
				li {
					a {
						span {
							text-decoration: underline;
			...
		}
* **Avoid using ID selector**. ID selectors increases specificity, which causes more complexity to override the style, undermining modularity.
* **Avoid using element selector**. Modular styles and markups should conform to their requirements and their requirements only. Meaning they should not be responsible for other elements that do not belong to the module.

  Element selectors in modular styles and markups may introduce unintended styling to non-module-specific elements. It is possible to use child selectors in order to use element selectors, but it may still cause unintended styling.

		// module base markup
		<ul class="profile">
			<li>type: <span>{{ type_name }}</span></li>
		</ul>

		// module style
		.profile {
			span {
				text-decoration:underline;
			}
		}

		// unintended styling
		<ul class="profile">
			<li>type: <span>{{ type_name }}</span></li>
			<li>
				<div class="another-module">
					<p>This is my bio. I'm cooler than you, so get over it.
						<span class="another-module-icon"></span> // oops
			...
		</ul>

## [Structure: Modules](id:structure-modules)
Encapsulation achieved through **module namespacing** instead of [SASS nesting](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#nested_rules)

	.module
	.module--modifier
	.module__component


### [Module Base](id:module-base)
Base module element; defines base styles

	// scss
	.status
	.ad-banner

	// html
	<div class="status"></div>
	<div class="ad-banner"></div>

### [Module Modifier](id:module-modifier)
Modification to module/component styles

	// scss
	.status--alert
	.status--code-red
	.status__label--huge

	// html
	<div class="status status--alert">
		<div class="status__label status__label--huge"></div>
	</div>

### [variant with modifiers](id:variant-with-mods)
avoid using more than 2 modifiers on an element:

* it avoids being too presentational in the markup

		<div class="status status--alert status--huge status--code-red status--rounded status--some-modifier"><div/>
* if an element needs more than 2 modifiers, [`@extend`](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend) the module to create a [variant module](#variant-module) to apply extra modifiers and custom styles to make a more semantic module

### caveat
CSS cascade may be important for modifiers, as it might override module base styles. **Place Module Modifier declarations below Module Base declaration**.


#### case study: module state
prefix state modifiers with `is-`. usually toggled by javascript.

2+ module modifier caveat does not apply to module states as it gets applied dynamically

	// scss
	.status--is-hidden
	.status--is-selected

	// html
	<div class="status status--code-red status--is-hidden"></div>


### [Module Component](id:module-component)
children elements of a module

	// scss
	// module
	.status

	// component
	.status__label
	.status__start-date
	.status--alert__icon

	// html
	<div class="status">
		<div class="status__label"></div>
	</div>

avoid more than 2 levels of component:

* long class selectors can occur

		.some-module__some-component__subcomponent-name__subsubcomp
* it creates a restriction on module complexity; maintaining modularity
* if a module requires more than 2 levels of components, create different modules for those components

> When I first started writing modules like this I’d often end up with huge modules with complex class names… most child components can be extracted out into their own standalone modules. So if you leave the positioning up to the parent, we end up with smaller, standalone modules. - [source](http://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/)

#### case study: collections module
module structure on collections may look this way, but `.words__word` styles could get more complicated

	.words
	.words__word
	.words__word--modifier
	.words__word__component

instead:

	.words
	.word
	.word--modifier
	.word__component

instead of using `-list`, pluralize collection container: end with an `s`

---

### [Nested Module](id:nested-module)
a module inside another module

		<div class="content">
    		<h1 class="headline"></h1>
		</div>

Here, there are two circumstances for `.headline`

* it is styled that way because it’s in `.content`, or
* whether it just happens to live in `.content`.

If it is the latter then it's a **simple nesting**. If it's the former then it's a **complex nesting**. `.content` serves as the **base module**, while `.headline` serves as the **nested module**

#### simple nesting
**nested module** that can stand on its own without any modification  inside a **base module**

simply drop the module into the markup

		// scss
		.post
		.advertisement

		// html
		<div class="post">
    		<div class="advertisement"></div>
		</div>

#### complex nesting
**nested module** that needs modification in order to be styled properly inside a **base module** (module context styling)

[`@extend`](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend) **nested module** as a component for the **base module**. Use the **nested module** namespace for the **base module** component.


	// scss
	.sidebar__advertisement {
		@extend .advertisement;
		box-shadow: none;
	}

	// html
	<div class="sidebar">
		<h1 class="sidebar__advertisement"></h1>
	</div>

[`@extend`](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend)ing the **nested module** will make the relationship explicit with the original module. Any modifications to the **nested module** are completely encapsulated in the **base module**.

A module should only manage its contents, and nothing outside of it: siblings and parent elements. This will ensure encapsulation completely within the module. Thus, **nested module** should not style when it's in a **base module**. Instead, the **base module** should style **nested modules**, if needed.

	// BAD
	.advertisement {			// advertisement module
		background-color: blue;
		color: white;
	}
	.post .advertisement {		// advertisement module in post module context
		color: grey;
	}


	// GOOD
	.advertisement {			// advertisement module
		background-color: blue;
		color: white;
	}

	.post {						// post module
		padding: 10px;
	}
	.post__advertisement {		// post component: advertisement
		@extend .advertisement;
		color: grey;
	}

### [Variant Module](id:variant-module)
a separate module for extending or modifying base module styles or a reoccurring combination of the base module. Primarily applies to [module element with more than two modifiers applied to it](#variant-with-mods).

	.status-modal {
		@extend .status;
		@extend .status--alert;
		@extend .status--rounded;
		@extend .status--huge;

		// dead centre layout w/ flex
		@include flexbox;
		@include flex-direction(column);
		@include justify-content(center);
		@include align-items(center);
	}

if a variant overrides many styles of the base module, it is essentially a completely different module. Refrain from extending the base module. Create a new module.


### [Scaffold Module](id:scaffold-module)
an extend-only module used as a scaffold for other modules and can't be used by itself e.g. grid-systems & layouts

It helps avoid presentational markup and promote sematic modules

	%media-object // Nicole Sullivan's Facebook layout object

	.news-feed-post {
		@extend %media-object;
	}


### Caveats
Extending modules (variant/nested-complex modules) might make it hard to debug/read on the browser dev toolkit when many other modules/elements extended the same modules

## [Resources](id:resources)
* [idiomatic CSS](https://github.com/necolas/idiomatic-css)
* [Github CSS Styleguide](https://github.com/styleguide/css)
* [CSS-Tricks SASS Styleguide](http://css-tricks.com/sass-style-guide/)
* [SMACSS](http://smacss.com/)
* [How to Scale and Maintain Legacy CSS with Sass and SMACSS](http://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/)
* [OOSCSS](http://blackfalcon.roughdraft.io/5255648)
* [BEM](http://bem.info/method/definitions/)
* [MindBEMding ](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* [HTML semantics and front-end architecture](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/)
* [SOLID CSS](http://blog.millermedeiros.com/solid-css/)
* [OOCSS](https://github.com/stubbornella/oocss/wiki)
* [Atomic Design](http://bradfrostweb.com/blog/post/atomic-web-design/)
* [Atomic Design with SASS](http://coding.smashingmagazine.com/2013/08/02/other-interface-atomic-design-sass/)