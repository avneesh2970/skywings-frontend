"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { MdArrowBack, MdAccessTime, MdPerson } from "react-icons/md";
import axios from "axios";
import mountain from "../../assets/products/image(10).png";
import tech from "../../assets/products/image(11).png";
import desktop from "../../assets/products/image(3).png";
import sigleman from "../../assets/products/image(4).png";
import concentration from "../../assets/products/image(5).png";
import podcast from "../../assets/products/image(6).png";

// Calculate reading time based on content length
export const calculateReadingTime = (content) => {
  // Average reading speed is about 200-250 words per minute
  const wordsPerMinute = 225;

  // Count words in the content
  const wordCount = content.trim().split(/\s+/).length;

  // Calculate reading time in minutes
  let readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Ensure minimum reading time is 1 minute
  readingTime = readingTime < 1 ? 1 : readingTime;

  return readingTime;
};

// Extract text content from HTML string
export const extractTextFromHTML = (html) => {
  if (!html) return "";

  // If we're in a browser environment
  if (typeof document !== "undefined") {
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    // Get the text content (strips HTML tags)
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  // Simple fallback for non-browser environments
  return html.replace(/<[^>]*>/g, "");
};

// Export the extended articles data for use in the news list component
export const articlesExtended = [
  {
    id: 1,
    image: mountain,
    author: "Alec Whitten",
    date: "17 Jan 2022",
    title: "Bill Walsh leadership lessons",
    description:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    tags: ["Leadership", "Management"],
    content: `
      <p>Bill Walsh is a towering figure in the history of the NFL. His advanced leadership transformed the San Francisco 49ers from the worst team in football to a legendary dynasty.</p>
      
      <h2>The Standard of Performance</h2>
      <p>Walsh implemented what he called the "Standard of Performance." He believed that the score takes care of itself when you focus on doing the small things correctly. His philosophy was about creating a culture of excellence where everyone knew exactly what was expected of them.</p>
      
      <p>Walsh didn't just coach football players; he coached people. He believed that teaching went beyond the X's and O's of football. It was about teaching people how to think, how to conduct themselves, and how to approach their work with pride and attention to detail.</p>
      
      <h2>Key Leadership Principles</h2>
      <ul>
        <li><strong>Be yourself:</strong> Walsh believed authenticity was crucial for leadership.</li>
        <li><strong>Focus on teaching:</strong> He saw his primary role as teaching rather than motivating.</li>
        <li><strong>Organizational leadership:</strong> Walsh understood that leadership extended beyond the field to the entire organization.</li>
        <li><strong>Contingency planning:</strong> He was meticulous about planning for all scenarios.</li>
        <li><strong>Attention to detail:</strong> Small details mattered as much as big strategies.</li>
      </ul>
      
      <p>Perhaps most importantly, Walsh understood that leadership was about building a system that could succeed even after he was gone. His coaching tree is one of the most impressive in NFL history, with coaches like Mike Holmgren, Andy Reid, and Mike Shanahan all tracing their lineage back to Walsh.</p>
      
      <p>The lessons from Bill Walsh extend far beyond football. They're applicable to any leadership position in any industry. Focus on the process, teach effectively, pay attention to details, and build something that lasts.</p>
    `,
    relatedArticles: [5, 2, 7],
  },
  {
    id: 2,
    image: tech,
    author: "Demi Wilkinson",
    date: "16 Jan 2022",
    title: "PM mental models",
    description:
      "Mental models are simple expressions of complex processes or relationships.",
    tags: ["Product", "Research", "Frameworks"],
    content: `
      <p>Mental models are frameworks, worldviews, representations, or explanations of how something works. They're how we simplify complexity, why we consider some things more relevant than others, and how we reason.</p>
      
      <h2>Why Mental Models Matter for Product Managers</h2>
      <p>As product managers, we're constantly making decisions with incomplete information. Mental models help us:</p>
      
      <ul>
        <li>Make better decisions faster</li>
        <li>Communicate complex ideas simply</li>
        <li>Identify patterns and opportunities</li>
        <li>Avoid common pitfalls and biases</li>
      </ul>
      
      <h2>Essential Mental Models for Product Managers</h2>
      
      <h3>1. First Principles Thinking</h3>
      <p>Break down complicated problems into basic elements and then reassemble them from the ground up.</p>
      
      <h3>2. Second-Order Thinking</h3>
      <p>Consider the long-term consequences of your decisions, not just the immediate outcomes.</p>
      
      <h3>3. Opportunity Cost</h3>
      <p>Every choice you make means you're not doing something else. What are you giving up?</p>
      
      <h3>4. Pareto Principle (80/20 Rule)</h3>
      <p>Roughly 80% of effects come from 20% of causes. Focus on the vital few, not the trivial many.</p>
      
      <h3>5. Jobs to Be Done</h3>
      <p>People don't buy products; they hire them to do a job. Understand what job your product is being hired to do.</p>
      
      <p>By developing a diverse set of mental models, product managers can approach problems from multiple angles and find innovative solutions that others might miss.</p>
    `,
    relatedArticles: [3, 4, 1],
  },
  {
    id: 3,
    image: desktop,
    author: "Candice Wu",
    date: "15 Jan 2022",
    title: "What is Wireframing?",
    description:
      "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: ["Design", "Research"],
    content: `
      <p>Wireframing is a crucial early step in the design process that helps establish the basic structure of a page before visual design and content are added.</p>
      
      <h2>What is a Wireframe?</h2>
      <p>A wireframe is a two-dimensional illustration of a page's interface that specifically focuses on space allocation and prioritization of content, functionalities available, and intended behaviors. Wireframes typically lack typographic style, color, or graphics since the main focus is on functionality, behavior, and priority of content.</p>
      
      <h2>Why Wireframe?</h2>
      <p>Wireframing serves several important purposes:</p>
      
      <ul>
        <li><strong>Clarity of function:</strong> Wireframes help clarify how users will interact with the interface.</li>
        <li><strong>Early testing:</strong> They allow for early testing of navigation paths and user flows.</li>
        <li><strong>Efficiency:</strong> It's much easier and less expensive to make changes at the wireframing stage than after visual designs are created.</li>
        <li><strong>Collaboration:</strong> Wireframes facilitate discussion among team members and stakeholders.</li>
      </ul>
      
      <h2>Types of Wireframes</h2>
      
      <h3>Low-fidelity wireframes</h3>
      <p>Basic visual representations that outline structure. They're quick to create and easy to adjust.</p>
      
      <h3>Mid-fidelity wireframes</h3>
      <p>More accurate representations with attention to spacing, proportions, and layout.</p>
      
      <h3>High-fidelity wireframes</h3>
      <p>Detailed wireframes that might include some visual design elements and are closer to the final product.</p>
      
      <h2>Wireframing Best Practices</h2>
      
      <ul>
        <li>Keep it simple and focus on structure</li>
        <li>Use a grid system for consistency</li>
        <li>Consider user flows and journeys</li>
        <li>Get feedback early and often</li>
        <li>Use standard conventions where appropriate</li>
      </ul>
      
      <p>Wireframing is not just about creating a skeleton of your design; it's about thinking through the user experience before getting caught up in the visual details.</p>
    `,
    relatedArticles: [4, 7, 2],
  },
  {
    id: 4,
    image: sigleman,
    author: "Natali Craig",
    date: "14 Jan 2022",
    title: "How collaboration makes us better designers",
    description:
      "Collaboration can make our teams stronger, and our individual designs better.",
    tags: ["Design", "Research"],
    content: `
      <p>Design is inherently collaborative. Even when we work alone, we're designing for others, considering their needs, preferences, and feedback. But true collaboration—working directly with others throughout the design process—can elevate our work to new heights.</p>
      
      <h2>The Benefits of Collaborative Design</h2>
      
      <h3>Diverse Perspectives Lead to Better Solutions</h3>
      <p>When designers collaborate with people from different backgrounds, disciplines, and expertise, they gain insights they might never have considered on their own. These diverse perspectives can lead to more innovative and inclusive solutions.</p>
      
      <h3>Faster Problem-Solving</h3>
      <p>Multiple minds working together can identify and solve problems more quickly than a single designer working in isolation. Collaboration allows for real-time feedback and iteration.</p>
      
      <h3>Shared Ownership and Buy-In</h3>
      <p>When stakeholders are involved in the design process, they develop a sense of ownership over the final product. This leads to better buy-in and support during implementation.</p>
      
      <h3>Continuous Learning</h3>
      <p>Collaboration exposes designers to new techniques, tools, and approaches. Each collaborative project is an opportunity to learn and grow professionally.</p>
      
      <h2>Effective Collaboration Techniques</h2>
      
      <ul>
        <li><strong>Design Workshops:</strong> Structured sessions where stakeholders work together to solve design challenges.</li>
        <li><strong>Pair Designing:</strong> Two designers working together on the same design, similar to pair programming.</li>
        <li><strong>Cross-Functional Teams:</strong> Bringing together designers, developers, product managers, and other stakeholders.</li>
        <li><strong>User Co-Creation:</strong> Involving end-users in the design process.</li>
        <li><strong>Design Critiques:</strong> Regular sessions where designers present their work for constructive feedback.</li>
      </ul>
      
      <p>Collaboration doesn't mean compromising your vision or diluting your expertise. Instead, it means leveraging the collective intelligence of your team to create something better than any individual could create alone.</p>
      
      <p>The best designers aren't lone geniuses working in isolation; they're skilled collaborators who know how to bring out the best in themselves and others.</p>
    `,
    relatedArticles: [3, 7, 9],
  },
  {
    id: 5,
    image: concentration,
    author: "Drew Cano",
    date: "13 Jan 2022",
    title: "Our top 10 Javascript frameworks to use",
    description:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    tags: ["Software Development", "Tools", "SaaS"],
    content: `
      <p>JavaScript frameworks have revolutionized web development, making it easier to build complex, interactive applications. With so many options available, choosing the right framework for your project can be challenging. Here's our list of the top 10 JavaScript frameworks to consider in 2022.</p>
      
      <h2>1. React</h2>
      <p>Developed by Facebook, React has become the most popular JavaScript library for building user interfaces. Its component-based architecture and virtual DOM make it efficient and flexible.</p>
      
      <h2>2. Vue.js</h2>
      <p>Vue combines the best aspects of React and Angular, offering a progressive framework that's easy to learn and integrate into projects. Its gentle learning curve makes it perfect for beginners.</p>
      
      <h2>3. Angular</h2>
      <p>Google's Angular is a complete framework with everything you need for large-scale applications. It's ideal for enterprise-level projects that require robust architecture.</p>
      
      <h2>4. Next.js</h2>
      <p>Built on top of React, Next.js offers server-side rendering, static site generation, and other performance optimizations that make it perfect for production applications.</p>
      
      <h2>5. Svelte</h2>
      <p>Unlike traditional frameworks, Svelte shifts the work to compile time rather than runtime, resulting in highly optimized vanilla JavaScript that runs faster in the browser.</p>
      
      <h2>6. Express.js</h2>
      <p>For backend development, Express.js is the go-to Node.js framework, offering a minimalist approach to building APIs and web applications.</p>
      
      <h2>7. Ember.js</h2>
      <p>Ember provides a complete solution with strong conventions, making it excellent for ambitious web applications that need structure and scalability.</p>
      
      <h2>8. Alpine.js</h2>
      <p>A lightweight framework for adding JavaScript behavior to your markup, Alpine.js is perfect for enhancing HTML without the complexity of larger frameworks.</p>
      
      <h2>9. Nuxt.js</h2>
      <p>For Vue.js developers, Nuxt.js offers similar benefits to what Next.js provides for React: server-side rendering, static site generation, and simplified configuration.</p>
      
      <h2>10. Preact</h2>
      <p>A lightweight alternative to React with the same API, Preact is ideal for projects where performance and small bundle size are critical.</p>
      
      <p>The best framework depends on your specific project requirements, team expertise, and performance needs. Consider starting with React or Vue.js if you're new to frameworks, as they offer excellent documentation and community support.</p>
    `,
    relatedArticles: [8, 1, 6],
  },
  {
    id: 6,
    image: podcast,
    author: "Orlando Diggs",
    date: "12 Jan 2022",
    title: "Podcast: Creating a better CX Community",
    description:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    tags: ["Podcasts", "Customer Success"],
    content: `
      <p>In this episode of our podcast, we explore the art and science of building customer experience communities that drive engagement, loyalty, and business growth.</p>
      
      <h2>Why Customer Experience Communities Matter</h2>
      <p>Customer experience (CX) communities create spaces where customers can connect with each other and with your brand beyond transactional relationships. These communities foster loyalty, provide valuable feedback, and can even reduce support costs as members help each other.</p>
      
      <h2>Key Elements of Successful CX Communities</h2>
      
      <h3>Clear Purpose</h3>
      <p>Every successful community needs a reason to exist. Is your community focused on product support, education, networking, or something else? Define this clearly before you begin.</p>
      
      <h3>Value Exchange</h3>
      <p>Members need to get value from participating. This could be access to exclusive content, early product features, recognition, or connections with peers. Similarly, your organization should define what value you hope to derive from the community.</p>
      
      <h3>Thoughtful Moderation</h3>
      <p>Communities need guidance and governance. Good moderators keep discussions on track, enforce community guidelines, and highlight valuable contributions.</p>
      
      <h3>Engaging Content</h3>
      <p>Regular, relevant content gives members a reason to return. This might include Q&A sessions, webinars, challenges, or user-generated content.</p>
      
      <h2>Starting Small and Scaling</h2>
      <p>You don't need to launch with a fully-featured community platform. Many successful communities begin with simple tools like Slack channels, Facebook groups, or forum software. As your community grows, you can invest in more sophisticated solutions.</p>
      
      <h2>Measuring Community Success</h2>
      <p>Look beyond simple metrics like member count. Consider engagement rates, customer retention among community members vs. non-members, support ticket deflection, and product feedback quality.</p>
      
      <p>Building a CX community takes time and consistent effort, but the rewards—deeper customer relationships, valuable insights, and brand advocacy—make it well worth the investment.</p>
    `,
    relatedArticles: [9, 4, 2],
  },
  {
    id: 7,
    image: sigleman,
    author: "Natali Craig",
    date: "14 Jan 2022",
    title: "How collaboration makes us better designers",
    description:
      "Collaboration can make our teams stronger, and our individual designs better.",
    tags: ["Design", "Research"],
    content: `
      <p>Design is inherently collaborative. Even when we work alone, we're designing for others, considering their needs, preferences, and feedback. But true collaboration—working directly with others throughout the design process—can elevate our work to new heights.</p>
      
      <h2>The Benefits of Collaborative Design</h2>
      
      <h3>Diverse Perspectives Lead to Better Solutions</h3>
      <p>When designers collaborate with people from different backgrounds, disciplines, and expertise, they gain insights they might never have considered on their own. These diverse perspectives can lead to more innovative and inclusive solutions.</p>
      
      <h3>Faster Problem-Solving</h3>
      <p>Multiple minds working together can identify and solve problems more quickly than a single designer working in isolation. Collaboration allows for real-time feedback and iteration.</p>
      
      <h3>Shared Ownership and Buy-In</h3>
      <p>When stakeholders are involved in the design process, they develop a sense of ownership over the final product. This leads to better buy-in and support during implementation.</p>
      
      <h3>Continuous Learning</h3>
      <p>Collaboration exposes designers to new techniques, tools, and approaches. Each collaborative project is an opportunity to learn and grow professionally.</p>
      
      <h2>Effective Collaboration Techniques</h2>
      
      <ul>
        <li><strong>Design Workshops:</strong> Structured sessions where stakeholders work together to solve design challenges.</li>
        <li><strong>Pair Designing:</strong> Two designers working together on the same design, similar to pair programming.</li>
        <li><strong>Cross-Functional Teams:</strong> Bringing together designers, developers, product managers, and other stakeholders.</li>
        <li><strong>User Co-Creation:</strong> Involving end-users in the design process.</li>
        <li><strong>Design Critiques:</strong> Regular sessions where designers present their work for constructive feedback.</li>
      </ul>
      
      <p>Collaboration doesn't mean compromising your vision or diluting your expertise. Instead, it means leveraging the collective intelligence of your team to create something better than any individual could create alone.</p>
      
      <p>The best designers aren't lone geniuses working in isolation; they're skilled collaborators who know how to bring out the best in themselves and others.</p>
    `,
    relatedArticles: [3, 4, 9],
  },
  {
    id: 8,
    image: concentration,
    author: "Drew Cano",
    date: "13 Jan 2022",
    title: "Our top 10 Javascript frameworks to use",
    description:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    tags: ["Software Development", "Tools", "SaaS"],
    content: `
      <p>JavaScript frameworks have revolutionized web development, making it easier to build complex, interactive applications. With so many options available, choosing the right framework for your project can be challenging. Here's our list of the top 10 JavaScript frameworks to consider in 2022.</p>
      
      <h2>1. React</h2>
      <p>Developed by Facebook, React has become the most popular JavaScript library for building user interfaces. Its component-based architecture and virtual DOM make it efficient and flexible.</p>
      
      <h2>2. Vue.js</h2>
      <p>Vue combines the best aspects of React and Angular, offering a progressive framework that's easy to learn and integrate into projects. Its gentle learning curve makes it perfect for beginners.</p>
      
      <h2>3. Angular</h2>
      <p>Google's Angular is a complete framework with everything you need for large-scale applications. It's ideal for enterprise-level projects that require robust architecture.</p>
      
      <h2>4. Next.js</h2>
      <p>Built on top of React, Next.js offers server-side rendering, static site generation, and other performance optimizations that make it perfect for production applications.</p>
      
      <h2>5. Svelte</h2>
      <p>Unlike traditional frameworks, Svelte shifts the work to compile time rather than runtime, resulting in highly optimized vanilla JavaScript that runs faster in the browser.</p>
      
      <h2>6. Express.js</h2>
      <p>For backend development, Express.js is the go-to Node.js framework, offering a minimalist approach to building APIs and web applications.</p>
      
      <h2>7. Ember.js</h2>
      <p>Ember provides a complete solution with strong conventions, making it excellent for ambitious web applications that need structure and scalability.</p>
      
      <h2>8. Alpine.js</h2>
      <p>A lightweight framework for adding JavaScript behavior to your markup, Alpine.js is perfect for enhancing HTML without the complexity of larger frameworks.</p>
      
      <h2>9. Nuxt.js</h2>
      <p>For Vue.js developers, Nuxt.js offers similar benefits to what Next.js provides for React: server-side rendering, static site generation, and simplified configuration.</p>
      
      <h2>10. Preact</h2>
      <p>A lightweight alternative to React with the same API, Preact is ideal for projects where performance and small bundle size are critical.</p>
      
      <p>The best framework depends on your specific project requirements, team expertise, and performance needs. Consider starting with React or Vue.js if you're new to frameworks, as they offer excellent documentation and community support.</p>
    `,
    relatedArticles: [5, 1, 6],
  },
  {
    id: 9,
    image: podcast,
    author: "Orlando Diggs",
    date: "12 Jan 2022",
    title: "Podcast: Creating a better CX Community",
    description:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    tags: ["Podcasts", "Customer Success"],
    content: `
      <p>In this episode of our podcast, we explore the art and science of building customer experience communities that drive engagement, loyalty, and business growth.</p>
      
      <h2>Why Customer Experience Communities Matter</h2>
      <p>Customer experience (CX) communities create spaces where customers can connect with each other and with your brand beyond transactional relationships. These communities foster loyalty, provide valuable feedback, and can even reduce support costs as members help each other.</p>
      
      <h2>Key Elements of Successful CX Communities</h2>
      
      <h3>Clear Purpose</h3>
      <p>Every successful community needs a reason to exist. Is your community focused on product support, education, networking, or something else? Define this clearly before you begin.</p>
      
      <h3>Value Exchange</h3>
      <p>Members need to get value from participating. This could be access to exclusive content, early product features, recognition, or connections with peers. Similarly, your organization should define what value you hope to derive from the community.</p>
      
      <h3>Thoughtful Moderation</h3>
      <p>Communities need guidance and governance. Good moderators keep discussions on track, enforce community guidelines, and highlight valuable contributions.</p>
      
      <h3>Engaging Content</h3>
      <p>Regular, relevant content gives members a reason to return. This might include Q&A sessions, webinars, challenges, or user-generated content.</p>
      
      <h2>Starting Small and Scaling</h2>
      <p>You don't need to launch with a fully-featured community platform. Many successful communities begin with simple tools like Slack channels, Facebook groups, or forum software. As your community grows, you can invest in more sophisticated solutions.</p>
      
      <h2>Measuring Community Success</h2>
      <p>Look beyond simple metrics like member count. Consider engagement rates, customer retention among community members vs. non-members, support ticket deflection, and product feedback quality.</p>
      
      <p>Building a CX community takes time and consistent effort, but the rewards—deeper customer relationships, valuable insights, and brand advocacy—make it well worth the investment.</p>
    `,
    relatedArticles: [6, 4, 2],
  },
];

export default function NewsDetail() {
  const { pathname } = useLocation();
  const location = useLocation();
  const { id } = useParams();
  const [dynamicArticle, setDynamicArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(null);

  // Check if this is a dynamic article from the API using state
  const isDynamic = location.state?.isDynamic;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    try {
      (async () => {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/news/update-views/${id}`
        );
      })();
    } catch (error) {
      console.log("error: ", error);
    }
  }, []);

  // Fetch dynamic article if needed
  useEffect(() => {
    if (isDynamic) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          console.log("Fetching dynamic article with ID:", id);

          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/news/${id}`
          );

          // Calculate reading time based on full content
          const articleReadingTime = calculateReadingTime(
            extractTextFromHTML(response.data.content)
          );

          setReadingTime(articleReadingTime);

          setDynamicArticle({
            ...response.data,
            image: response.data.image
              ? `${import.meta.env.VITE_API_URL}${response.data.image}`
              : null,
            date: new Date(response.data.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          });
        } catch (err) {
          console.error("Error fetching article:", err);
          setError("Failed to load article");
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    } else {
      // For static articles, calculate reading time from the content
      const staticArticle = articlesExtended.find(
        (article) => article.id === Number.parseInt(id)
      );

      if (staticArticle) {
        const articleReadingTime = calculateReadingTime(
          extractTextFromHTML(staticArticle.content)
        );
        setReadingTime(articleReadingTime);
      }
    }
  }, [id, isDynamic]);

  // For static articles, find the article based on the ID
  const staticArticle = !isDynamic
    ? articlesExtended.find((article) => article.id === Number.parseInt(id))
    : null;

  // Use either the dynamic or static article
  const article = isDynamic ? dynamicArticle : staticArticle;

  // Find related articles (only for static articles)
  const relatedArticles =
    !isDynamic && staticArticle?.relatedArticles
      ? staticArticle.relatedArticles.map((relId) =>
          articlesExtended.find((a) => a.id === relId)
        )
      : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Article not found
          </h1>
          <p className="mt-4 text-gray-600">
            {error ||
              "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/news"
            className="mt-6 inline-flex items-center text-purple-700 hover:text-purple-900"
          >
            <MdArrowBack className="mr-2" /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Link
          to="/news"
          className="inline-flex items-center text-purple-700 hover:text-purple-900 mb-6 font-medium"
        >
          <MdArrowBack className="mr-2" /> Back to News
        </Link>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="h-64 md:h-96 overflow-hidden relative">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", article.image);
                e.target.src = "/placeholder.svg";
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags &&
                    article.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-purple-600/80 text-white text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center mb-6 text-sm text-gray-600 gap-4">
              <div className="flex items-center">
                <MdPerson className="mr-1 text-purple-600" />
                {article.author}
              </div>
              <div className="flex items-center">
                <MdAccessTime className="mr-1 text-purple-600" />
                {article.date}
              </div>
              {/* Display reading time */}
              {readingTime && (
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <MdAccessTime className="mr-1 text-purple-600" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Use dangerouslySetInnerHTML for BOTH dynamic and static articles */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-purple-900 prose-a:text-purple-700 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {!isDynamic && relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(
                (relatedArticle) =>
                  relatedArticle && (
                    <Link
                      to={`/news/${relatedArticle.id}`}
                      state={{ isDynamic: false }}
                      key={relatedArticle.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedArticle.image || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              relatedArticle.image
                            );
                            e.target.src = "/placeholder.svg";
                            e.target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-sm text-purple-600 mb-2">
                          {relatedArticle.author} • {relatedArticle.date}
                        </p>
                        <h3 className="text-lg font-semibold mb-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedArticle.description}
                        </p>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
