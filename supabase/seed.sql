-- NaghamOS Seed Data
-- Run after schema.sql and functions.sql

-- ═══════════════════════════════════════════════════════════
-- SKILL TRACKS
-- ═══════════════════════════════════════════════════════════

INSERT INTO skill_tracks (id, name_en, name_ar, description_en, description_ar, color, icon, sort_order) VALUES
('figma', 'Figma & Framer', 'فيجما وفريمر', 'Go from basics to designing wow websites with motion', 'من الأساسيات إلى تصميم مواقع مذهلة بالحركة', '#A259FF', 'figma', 1),
('photoshop', 'Photoshop', 'فوتوشوب', 'Photo editing, compositing, and creative manipulation', 'تحرير الصور والتركيب والمعالجة الإبداعية', '#31A8FF', 'image', 2),
('illustrator', 'Illustrator', 'إليستريتور', 'Vector illustration, logo design, and creative graphics', 'رسم المتجهات وتصميم الشعارات والرسومات الإبداعية', '#FF9A00', 'pen-tool', 3),
('graphic-design', 'Graphic Design', 'التصميم الجرافيكي', 'Design thinking, composition, and creative problem-solving', 'التفكير التصميمي والتكوين وحل المشكلات الإبداعية', '#FF5A85', 'palette', 4),
('blender', 'Blender 3D', 'بلندر ثلاثي الأبعاد', 'Basic 3D modeling, materials, lighting, and rendering', 'النمذجة ثلاثية الأبعاد الأساسية والمواد والإضاءة', '#E87D0D', 'box', 5),
('ai-tools', 'AI Tools', 'أدوات الذكاء الاصطناعي', 'Become fluent in using AI tools for creative work', 'إتقان استخدام أدوات الذكاء الاصطناعي في العمل الإبداعي', '#83EDFF', 'cpu', 6),
('coding-ai', 'Coding with AI', 'البرمجة مع الذكاء الاصطناعي', 'Use AI to write, understand, and modify code', 'استخدام الذكاء الاصطناعي لكتابة وفهم وتعديل الكود', '#DCFF7B', 'code', 7);

-- ═══════════════════════════════════════════════════════════
-- MODULES & LESSONS — Figma Track
-- ═══════════════════════════════════════════════════════════

INSERT INTO modules (id, track_id, name_en, name_ar, description_en, sort_order, xp_reward) VALUES
('10000000-0000-4000-a000-000000000001', 'figma', 'Figma Foundations Refresh', 'تحديث أساسيات فيجما', 'Master the fundamentals of Figma', 1, 100),
('10000000-0000-4000-a000-000000000002', 'figma', 'Advanced Figma Techniques', 'تقنيات فيجما المتقدمة', 'Complex prototyping and design systems', 2, 100),
('10000000-0000-4000-a000-000000000003', 'figma', 'Framer Fundamentals', 'أساسيات فريمر', 'Build interactive websites with Framer', 3, 100),
('10000000-0000-4000-a000-000000000004', 'figma', 'Motion & Scroll Magic', 'سحر الحركة والتمرير', 'Create stunning scroll-triggered animations', 4, 100),
('10000000-0000-4000-a000-000000000005', 'figma', 'Real World Projects', 'مشاريع حقيقية', 'Apply your skills to real projects', 5, 150);

INSERT INTO lessons (id, module_id, name_en, name_ar, lesson_type, difficulty, estimated_minutes, xp_reward, sort_order, ai_system_prompt) VALUES
-- Module 1: Figma Foundations
('20000000-0000-4000-b000-000000000001', '10000000-0000-4000-a000-000000000001', 'Frames vs Groups vs Sections', 'الإطارات مقابل المجموعات مقابل الأقسام', 'ai_interactive', 'beginner', 20, 25, 1, 'Teach the difference between Frames, Groups, and Sections in Figma. Use visual analogies. A Frame is like a container with superpowers (auto layout, constraints, clip content). A Group is just a folder. A Section is for organizing your canvas. Include exercises where the learner decides which to use.'),
('20000000-0000-4000-b000-000000000002', '10000000-0000-4000-a000-000000000001', 'Auto Layout Mastery', 'إتقان التخطيط التلقائي', 'ai_interactive', 'beginner', 25, 25, 2, 'Deep dive into Auto Layout in Figma. Cover: direction, spacing, padding, alignment, fill/hug/fixed sizing, absolute positioning within auto layout, nested auto layouts. Use the analogy of a smart shelf that rearranges items automatically.'),
('20000000-0000-4000-b000-000000000003', '10000000-0000-4000-a000-000000000001', 'Components & Variants', 'المكونات والمتغيرات', 'ai_interactive', 'beginner', 25, 25, 3, 'Explain Figma Components and Variants. Cover: creating components, component properties, variants (boolean, text, instance swap), component sets. Think of components as master templates and variants as different states of the same thing.'),
('20000000-0000-4000-b000-000000000004', '10000000-0000-4000-a000-000000000001', 'Figma Styles & Variables', 'أنماط ومتغيرات فيجما', 'ai_interactive', 'beginner', 20, 25, 4, 'Teach Figma Styles (color, text, effect, grid) and Variables (color variables, number variables, boolean variables, string variables). Explain the design token concept and why consistency matters.'),
('20000000-0000-4000-b000-000000000005', '10000000-0000-4000-a000-000000000001', 'Challenge: Rebuild a Dribbble Shot', 'تحدي: إعادة بناء تصميم من Dribbble', 'challenge', 'beginner', 45, 50, 5, 'Challenge the learner to pick a beautiful Dribbble shot and rebuild it in Figma from scratch using proper Frames, Auto Layout, and Components. Guide them through the process step by step. Ask them to share what they chose and help them plan the structure.'),

-- Module 2: Advanced Figma
('20000000-0000-4000-b000-000000000006', '10000000-0000-4000-a000-000000000002', 'Complex Prototyping', 'النماذج الأولية المعقدة', 'ai_interactive', 'intermediate', 30, 25, 1, 'Teach advanced prototyping in Figma: Smart Animate, Variables for interactive prototypes, conditional logic, component interactions, scroll behavior, video/GIF in prototypes. Make it exciting by showing what amazing prototypes look like.'),
('20000000-0000-4000-b000-000000000007', '10000000-0000-4000-a000-000000000002', 'Design Systems Architecture', 'هندسة أنظمة التصميم', 'ai_interactive', 'intermediate', 30, 25, 2, 'Explain how to architect a scalable design system: naming conventions, component hierarchy, token structure, documentation within Figma, team library management. Use examples from popular design systems.'),
('20000000-0000-4000-b000-000000000008', '10000000-0000-4000-a000-000000000002', 'Figma Plugins That Boost Productivity', 'إضافات فيجما لتعزيز الإنتاجية', 'ai_interactive', 'intermediate', 20, 25, 3, 'Tour essential Figma plugins: Stark (accessibility), Content Reel (placeholder content), Unsplash, IconFinder, Batch Styler, Contrast, and AI-powered plugins. Explain when and why to use each.'),
('20000000-0000-4000-b000-000000000009', '10000000-0000-4000-a000-000000000002', 'Responsive Design in Figma', 'التصميم المتجاوب في فيجما', 'ai_interactive', 'intermediate', 25, 25, 4, 'Teach responsive design principles in Figma: breakpoints, constraints, min/max width, responsive components, designing for mobile-first. Show how to create one component that works across screen sizes.'),
('20000000-0000-4000-b000-000000000010', '10000000-0000-4000-a000-000000000002', 'Challenge: Responsive Landing Page', 'تحدي: صفحة هبوط متجاوبة', 'challenge', 'intermediate', 60, 100, 5, 'Challenge: Design a responsive landing page with interactive prototype. Must include: hero section, feature grid, testimonials, CTA, footer. Must work at desktop, tablet, and mobile breakpoints. Guide the learner through the design process.'),

-- Module 3: Framer
('20000000-0000-4000-b000-000000000011', '10000000-0000-4000-a000-000000000003', 'Framer Interface & Mental Model', 'واجهة وعقلية فريمر', 'ai_interactive', 'beginner', 25, 25, 1, 'Introduction to Framer: how it differs from Figma (it is a real website builder), the interface, pages, components, canvas vs code, publish flow. Help the learner understand the shift in mental model.'),
('20000000-0000-4000-b000-000000000012', '10000000-0000-4000-a000-000000000003', 'Components in Framer', 'المكونات في فريمر', 'ai_interactive', 'intermediate', 25, 25, 2, 'Teach Framer components: props, states, variants, effects, interactions. Show how Framer components are more powerful than Figma because they are real interactive elements.'),
('20000000-0000-4000-b000-000000000013', '10000000-0000-4000-a000-000000000003', 'Animations & Transitions', 'الرسوم المتحركة والانتقالات', 'ai_interactive', 'intermediate', 30, 25, 3, 'Cover Framer animations: appear animations, scroll effects, hover states, page transitions, spring physics, stagger effects. Show examples of beautiful motion design.'),
('20000000-0000-4000-b000-000000000014', '10000000-0000-4000-a000-000000000003', 'CMS in Framer', 'نظام إدارة المحتوى في فريمر', 'ai_interactive', 'intermediate', 20, 25, 4, 'Teach Framer CMS: collections, dynamic pages, content management, filtering, sorting. Show how to build data-driven pages.'),

-- Module 4: Motion
('20000000-0000-4000-b000-000000000015', '10000000-0000-4000-a000-000000000004', 'Motion Design Principles', 'مبادئ تصميم الحركة', 'ai_interactive', 'intermediate', 25, 25, 1, 'Teach fundamental motion design principles: timing, easing curves, choreography, anticipation, follow-through, secondary action. Use real-world analogies (a ball bouncing, a door opening).'),
('20000000-0000-4000-b000-000000000016', '10000000-0000-4000-a000-000000000004', 'Scroll-Triggered Animations', 'الرسوم المتحركة بالتمرير', 'ai_interactive', 'intermediate', 30, 25, 2, 'Deep dive into scroll-triggered animations: parallax, reveal on scroll, transform on scroll, progress-based animations, pin sections. Show examples from award-winning websites.'),
('20000000-0000-4000-b000-000000000017', '10000000-0000-4000-a000-000000000004', 'Micro-interactions', 'التفاعلات الدقيقة', 'ai_interactive', 'intermediate', 25, 25, 3, 'Teach micro-interactions: hover effects, click feedback, toggle animations, drag interactions, loading states. Explain how small details make a huge difference in user experience.'),
('20000000-0000-4000-b000-000000000018', '10000000-0000-4000-a000-000000000004', 'Challenge: Wow Landing Page', 'تحدي: صفحة هبوط مذهلة', 'challenge', 'advanced', 90, 150, 4, 'Challenge: Build a landing page with 5+ scroll-triggered animations in Framer. Must include parallax, reveal animations, and at least one creative micro-interaction. Guide through the entire process.');

-- ═══════════════════════════════════════════════════════════
-- MODULES & LESSONS — AI Tools Track (sample)
-- ═══════════════════════════════════════════════════════════

INSERT INTO modules (id, track_id, name_en, name_ar, description_en, sort_order, xp_reward) VALUES
('10000000-0000-4000-a000-000000000006', 'ai-tools', 'Understanding AI', 'فهم الذكاء الاصطناعي', 'Learn how AI works and how to use it effectively', 1, 100),
('10000000-0000-4000-a000-000000000007', 'ai-tools', 'AI for Design', 'الذكاء الاصطناعي للتصميم', 'Use AI tools in your design workflow', 2, 100);

INSERT INTO lessons (id, module_id, name_en, name_ar, lesson_type, difficulty, estimated_minutes, xp_reward, sort_order, ai_system_prompt) VALUES
('20000000-0000-4000-b000-000000000019', '10000000-0000-4000-a000-000000000006', 'What is AI?', 'ما هو الذكاء الاصطناعي؟', 'ai_interactive', 'beginner', 15, 25, 1, 'Explain AI in simple, visual terms. No hype, no jargon. Use analogies: AI is like a very fast pattern-matching machine. LLMs are like autocomplete on steroids. Cover: what AI can and cannot do, how to think about AI as a creative tool, not a replacement.'),
('20000000-0000-4000-b000-000000000020', '10000000-0000-4000-a000-000000000006', 'How LLMs Work', 'كيف تعمل نماذج اللغة الكبيرة', 'ai_interactive', 'beginner', 20, 25, 2, 'Visual explanation of LLMs: tokens, context window, temperature, prompts. Use the analogy of a conversation where the AI predicts the next word. Explain why context matters and why AI sometimes hallucinates.'),
('20000000-0000-4000-b000-000000000021', '10000000-0000-4000-a000-000000000006', 'Prompt Engineering Basics', 'أساسيات هندسة المحادثات', 'ai_interactive', 'beginner', 25, 25, 3, 'Teach prompt engineering fundamentals: structure, specificity, examples, role-setting, constraints. Practice with real exercises where the learner writes prompts and predicts the output.'),
('20000000-0000-4000-b000-000000000022', '10000000-0000-4000-a000-000000000007', 'Midjourney for Design', 'Midjourney للتصميم', 'ai_interactive', 'beginner', 25, 25, 1, 'Teach how to use Midjourney for design assets: prompting for specific styles, moods, and compositions. Cover parameters, aspect ratios, style references, and how to iterate on results.'),
('20000000-0000-4000-b000-000000000023', '10000000-0000-4000-a000-000000000007', 'AI in Figma', 'الذكاء الاصطناعي في فيجما', 'ai_interactive', 'intermediate', 20, 25, 2, 'Tour AI plugins for Figma: Magician, Ando, content generators, image generators. Show how AI accelerates the design workflow without replacing creativity.');

-- ═══════════════════════════════════════════════════════════
-- MODULES & LESSONS — Graphic Design Track (sample)
-- ═══════════════════════════════════════════════════════════

INSERT INTO modules (id, track_id, name_en, name_ar, description_en, sort_order, xp_reward) VALUES
('10000000-0000-4000-a000-000000000008', 'graphic-design', 'Design Principles', 'مبادئ التصميم', 'Master the foundations of visual design', 1, 100);

INSERT INTO lessons (id, module_id, name_en, name_ar, lesson_type, difficulty, estimated_minutes, xp_reward, sort_order, ai_system_prompt) VALUES
('20000000-0000-4000-b000-000000000024', '10000000-0000-4000-a000-000000000008', 'Hierarchy, Contrast, Alignment', 'التسلسل الهرمي والتباين والمحاذاة', 'ai_interactive', 'beginner', 20, 25, 1, 'Teach core design principles: visual hierarchy (what catches the eye first), contrast (making important elements stand out), alignment (creating order and connection), proximity (grouping related elements), repetition (creating consistency). Use before/after examples.'),
('20000000-0000-4000-b000-000000000025', '10000000-0000-4000-a000-000000000008', 'Color Theory', 'نظرية الألوان', 'ai_interactive', 'beginner', 25, 25, 2, 'Teach color theory for designers: color psychology (what emotions colors evoke), harmonies (complementary, analogous, triadic), accessibility (contrast ratios, color blindness), creating color palettes. Reference Arabic/Egyptian art where relevant.'),
('20000000-0000-4000-b000-000000000026', '10000000-0000-4000-a000-000000000008', 'Typography Fundamentals', 'أساسيات الطباعة', 'ai_interactive', 'beginner', 20, 25, 3, 'Teach typography: font pairing principles, type scale, line height, letter spacing, typographic rhythm, serif vs sans-serif, when to use display fonts. Make it visual and practical.'),
('20000000-0000-4000-b000-000000000027', '10000000-0000-4000-a000-000000000008', 'Challenge: Redesign a Bad Poster', 'تحدي: إعادة تصميم ملصق سيء', 'challenge', 'beginner', 45, 75, 4, 'Challenge: Present the learner with a poorly designed poster (describe it) and guide them to redesign it using proper design principles. Walk through the critique process and the redesign decisions together.');

-- ═══════════════════════════════════════════════════════════
-- ACHIEVEMENTS
-- ═══════════════════════════════════════════════════════════

INSERT INTO achievements (id, name_en, name_ar, description_en, description_ar, icon, xp_reward, category) VALUES
('first_lesson', 'First Step', 'الخطوة الأولى', 'Complete your first lesson', 'أكمل أول درس لك', '🌱', 50, 'milestone'),
('first_challenge', 'First Blood', 'أول إنجاز', 'Complete your first challenge', 'أكمل أول تحدي لك', '🎯', 50, 'milestone'),
('first_project', 'First Delivery', 'أول تسليم', 'Submit your first project', 'قدم أول مشروع لك', '📦', 100, 'milestone'),
('first_module', 'Summit', 'القمة', 'Complete your first full module', 'أكمل أول وحدة كاملة', '🏔️', 100, 'milestone'),
('deep_dive', 'Deep Dive', 'غوص عميق', 'Spend 2+ hours in a single session', 'اقض أكثر من ساعتين في جلسة واحدة', '🌊', 75, 'milestone'),
('streak_3', 'Spark', 'شرارة', '3-day streak', 'سلسلة 3 أيام', '🔥', 50, 'streak'),
('streak_7', 'Flame', 'لهب', '7-day streak', 'سلسلة 7 أيام', '🔥', 100, 'streak'),
('streak_14', 'Blaze', 'حريق', '14-day streak', 'سلسلة 14 يوم', '🔥', 150, 'streak'),
('streak_30', 'Unstoppable', 'لا يمكن إيقافه', '30-day streak', 'سلسلة 30 يوم', '☀️', 300, 'streak'),
('streak_60', 'Supernova', 'نجم عملاق', '60-day streak', 'سلسلة 60 يوم', '⭐', 400, 'streak'),
('streak_90', 'Diamond', 'ألماس', '90-day streak', 'سلسلة 90 يوم', '💎', 500, 'streak'),
('night_owl', 'Night Owl', 'بومة الليل', 'Complete a lesson after midnight', 'أكمل درسًا بعد منتصف الليل', '🦉', 50, 'hidden'),
('early_bird', 'Early Bird', 'الطائر المبكر', 'Complete a lesson before 7 AM', 'أكمل درسًا قبل السابعة صباحًا', '🌅', 50, 'hidden'),
('polymath', 'Polymath', 'متعدد المعارف', 'Active in 4+ tracks in one week', 'نشط في 4+ مسارات في أسبوع واحد', '🎨', 100, 'hidden'),
('curious_mind', 'Curious Mind', 'عقل فضولي', 'Ask AI 50+ questions', 'اسأل الذكاء الاصطناعي 50+ سؤال', '💬', 100, 'hidden'),
('speed_runner', 'Speed Runner', 'عداء السرعة', 'Complete a lesson in under 5 minutes', 'أكمل درسًا في أقل من 5 دقائق', '🏃', 50, 'hidden'),
('surprise', 'Surprise!', 'مفاجأة!', 'A special gift from your mentor', 'هدية خاصة من مرشدك', '🎁', 200, 'hidden');
