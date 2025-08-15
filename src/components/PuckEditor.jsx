import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';

// Define the components that can be used in the editor
const config = {
    components: {
        HeadingBlock: {
            fields: {
                children: {
                    type: 'text',
                },
                level: {
                    type: 'select',
                    options: [
                        { label: 'H1', value: 1 },
                        { label: 'H2', value: 2 },
                        { label: 'H3', value: 3 },
                        { label: 'H4', value: 4 },
                        { label: 'H5', value: 5 },
                        { label: 'H6', value: 6 },
                    ],
                },
                color: {
                    type: 'text',
                },
                align: {
                    type: 'select',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ],
                },
            },
            defaultProps: {
                children: 'Heading',
                level: 1,
                color: '#000000',
                align: 'left',
            },
            render: ({ children, level, color, align }) => {
                const Tag = `h${level}`;
                return (
                    <Tag
                        style={{
                            color,
                            textAlign: align,
                            margin: '0 0 16px 0',
                            fontSize: level === 1 ? '2.5rem' : level === 2 ? '2rem' : level === 3 ? '1.5rem' : '1.25rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {children}
                    </Tag>
                );
            },
        },
        TextBlock: {
            fields: {
                text: {
                    type: 'textarea',
                },
                color: {
                    type: 'text',
                },
                fontSize: {
                    type: 'number',
                },
                align: {
                    type: 'select',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' },
                    ],
                },
            },
            defaultProps: {
                text: 'Enter your text here...',
                color: '#333333',
                fontSize: 16,
                align: 'left',
            },
            render: ({ text, color, fontSize, align }) => (
                <p
                    style={{
                        color,
                        fontSize: `${fontSize}px`,
                        textAlign: align,
                        lineHeight: 1.6,
                        margin: '0 0 16px 0',
                    }}
                >
                    {text}
                </p>
            ),
        },
        ImageBlock: {
            fields: {
                src: {
                    type: 'text',
                },
                alt: {
                    type: 'text',
                },
                width: {
                    type: 'number',
                },
                height: {
                    type: 'number',
                },
                align: {
                    type: 'select',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ],
                },
            },
            defaultProps: {
                src: 'https://via.placeholder.com/400x300',
                alt: 'Placeholder image',
                width: 400,
                height: 300,
                align: 'center',
            },
            render: ({ src, alt, width, height, align }) => (
                <div style={{ textAlign: align, margin: '16px 0' }}>
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            width: width ? `${width}px` : 'auto',
                            height: height ? `${height}px` : 'auto',
                            maxWidth: '100%',
                            borderRadius: '8px',
                        }}
                    />
                </div>
            ),
        },
        ButtonBlock: {
            fields: {
                text: {
                    type: 'text',
                },
                href: {
                    type: 'text',
                },
                variant: {
                    type: 'select',
                    options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                    ],
                },
                size: {
                    type: 'select',
                    options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                    ],
                },
                align: {
                    type: 'select',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ],
                },
            },
            defaultProps: {
                text: 'Click me',
                href: '#',
                variant: 'primary',
                size: 'md',
                align: 'left',
            },
            render: ({ text, href, variant, size, align }) => {
                const getButtonStyles = () => {
                    const baseStyles = {
                        display: 'inline-block',
                        padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
                        transition: 'all 0.2s ease',
                        border: '2px solid transparent',
                        cursor: 'pointer',
                    };

                    switch (variant) {
                        case 'primary':
                            return {
                                ...baseStyles,
                                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                                color: 'white',
                            };
                        case 'secondary':
                            return {
                                ...baseStyles,
                                background: '#6b7280',
                                color: 'white',
                            };
                        case 'outline':
                            return {
                                ...baseStyles,
                                background: 'transparent',
                                color: '#10b981',
                                border: '2px solid #10b981',
                            };
                        default:
                            return baseStyles;
                    }
                };

                return (
                    <div style={{ textAlign: align, margin: '16px 0' }}>
                        <a href={href} style={getButtonStyles()}>
                            {text}
                        </a>
                    </div>
                );
            },
        },
        SpacerBlock: {
            fields: {
                height: {
                    type: 'number',
                },
            },
            defaultProps: {
                height: 32,
            },
            render: ({ height }) => (
                <div style={{ height: `${height}px` }} />
            ),
        },
        ContainerBlock: {
            fields: {
                backgroundColor: {
                    type: 'text',
                },
                padding: {
                    type: 'number',
                },
                borderRadius: {
                    type: 'number',
                },
                maxWidth: {
                    type: 'number',
                },
            },
            defaultProps: {
                backgroundColor: 'transparent',
                padding: 20,
                borderRadius: 8,
                maxWidth: 1200,
            },
            render: ({ children, backgroundColor, padding, borderRadius, maxWidth }) => (
                <div
                    style={{
                        backgroundColor,
                        padding: `${padding}px`,
                        borderRadius: `${borderRadius}px`,
                        maxWidth: `${maxWidth}px`,
                        margin: '0 auto',
                    }}
                >
                    {children}
                </div>
            ),
        },
    },
};

// Function to generate default content for each page
const getDefaultPageContent = (pageName, language = 'en') => {
    const isArabic = language === 'ar';

    const defaultContents = {
        'Home Page': {
            content: [
                {
                    type: 'HeadingBlock',
                    props: {
                        id: 'hero-title',
                        children: isArabic ? 'قم بتوسيع أعمال التجارة الإلكترونية الخاصة بك' : 'Scale Your E-commerce Business',
                        level: 1,
                        color: '#ffffff',
                        align: 'center',
                    },
                },
                {
                    type: 'TextBlock',
                    props: {
                        id: 'hero-description',
                        text: isArabic
                            ? 'نحن نساعد العلامات التجارية الطموحة على تحقيق نمو استثنائي من خلال التسويق المدفوع بالبيانات وتطوير الويب المهني وحلول التجارة الإلكترونية المتطورة.'
                            : 'We help ambitious brands achieve extraordinary growth through data-driven marketing, professional web development, and cutting-edge e-commerce solutions.',
                        color: '#e5e7eb',
                        fontSize: 18,
                        align: 'center',
                    },
                },
                {
                    type: 'ButtonBlock',
                    props: {
                        id: 'cta-button',
                        text: isArabic ? 'ابدأ رحلة نموك' : 'Start Your Growth Journey',
                        href: '/contact',
                        variant: 'primary',
                        size: 'lg',
                        align: 'center',
                    },
                },
            ],
            root: {
                props: {
                    title: isArabic ? 'الصفحة الرئيسية' : 'Home Page',
                },
            },
        },
        'Services Page': {
            content: [
                {
                    type: 'HeadingBlock',
                    props: {
                        id: 'services-title',
                        children: isArabic ? 'خدماتنا' : 'Our Services',
                        level: 1,
                        color: '#1f2937',
                        align: 'center',
                    },
                },
                {
                    type: 'TextBlock',
                    props: {
                        id: 'services-description',
                        text: isArabic
                            ? 'نقدم مجموعة شاملة من الخدمات لمساعدة عملك على النمو والازدهار في العالم الرقمي.'
                            : 'We offer a comprehensive range of services to help your business grow and thrive in the digital world.',
                        color: '#4b5563',
                        fontSize: 16,
                        align: 'center',
                    },
                },
            ],
            root: {
                props: {
                    title: isArabic ? 'صفحة الخدمات' : 'Services Page',
                },
            },
        },
        'About Page': {
            content: [
                {
                    type: 'HeadingBlock',
                    props: {
                        id: 'about-title',
                        children: isArabic ? 'من نحن' : 'About Us',
                        level: 1,
                        color: '#1f2937',
                        align: 'center',
                    },
                },
                {
                    type: 'TextBlock',
                    props: {
                        id: 'about-description',
                        text: isArabic
                            ? 'نحن وكالة نمو رقمي متخصصة في التجارة الإلكترونية والتسويق الرقمي وتطوير الويب.'
                            : 'We are a digital growth agency specializing in e-commerce, digital marketing, and web development.',
                        color: '#4b5563',
                        fontSize: 16,
                        align: 'center',
                    },
                },
            ],
            root: {
                props: {
                    title: isArabic ? 'صفحة من نحن' : 'About Page',
                },
            },
        },
        'Clients Page': {
            content: [
                {
                    type: 'HeadingBlock',
                    props: {
                        id: 'clients-title',
                        children: isArabic ? 'عملاؤنا' : 'Our Clients',
                        level: 1,
                        color: '#1f2937',
                        align: 'center',
                    },
                },
                {
                    type: 'TextBlock',
                    props: {
                        id: 'clients-description',
                        text: isArabic
                            ? 'نفخر بالعمل مع مجموعة متنوعة من العملاء الرائعين من جميع أنحاء العالم.'
                            : 'We are proud to work with an amazing variety of clients from around the world.',
                        color: '#4b5563',
                        fontSize: 16,
                        align: 'center',
                    },
                },
            ],
            root: {
                props: {
                    title: isArabic ? 'صفحة العملاء' : 'Clients Page',
                },
            },
        },
        'Case Studies': {
            content: [
                {
                    type: 'HeadingBlock',
                    props: {
                        id: 'case-studies-title',
                        children: isArabic ? 'دراسات الحالة' : 'Case Studies',
                        level: 1,
                        color: '#1f2937',
                        align: 'center',
                    },
                },
                {
                    type: 'TextBlock',
                    props: {
                        id: 'case-studies-description',
                        text: isArabic
                            ? 'اكتشف كيف ساعدنا عملاءنا في تحقيق نتائج استثنائية.'
                            : 'Discover how we helped our clients achieve exceptional results.',
                        color: '#4b5563',
                        fontSize: 16,
                        align: 'center',
                    },
                },
            ],
            root: {
                props: {
                    title: isArabic ? 'دراسات الحالة' : 'Case Studies',
                },
            },
        },
    };

    return defaultContents[pageName] || {
        content: [
            {
                type: 'HeadingBlock',
                props: {
                    id: 'default-title',
                    children: isArabic ? 'مرحباً بك في محرر المحتوى' : 'Welcome to Content Editor',
                    level: 1,
                    color: '#1f2937',
                    align: 'center',
                },
            },
            {
                type: 'TextBlock',
                props: {
                    id: 'default-description',
                    text: isArabic
                        ? 'ابدأ بسحب المكونات من الشريط الجانبي لإنشاء محتوى رائع.'
                        : 'Start by dragging components from the sidebar to create amazing content.',
                    color: '#4b5563',
                    fontSize: 16,
                    align: 'center',
                },
            },
        ],
        root: {
            props: {
                title: pageName,
            },
        },
    };
};

export default function PuckEditor({ data, onSave, language = 'en', selectedPage = 'Home Page' }) {
    // Use provided data or generate default content for the selected page
    const editorData = data || getDefaultPageContent(selectedPage, language);

    const handleSave = (newData) => {
        onSave(newData);
    };

    return (
        <div className="h-screen">
            <Puck
                config={config}
                data={editorData}
                onPublish={handleSave}
                headerTitle={language === 'ar' ? 'محرر المحتوى' : 'Content Editor'}
                headerPath={language === 'ar' ? `تعديل ${selectedPage}` : `Edit ${selectedPage}`}
            />
        </div>
    );
}

