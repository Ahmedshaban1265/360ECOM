import React, { useState } from 'react';
import ArabicText, { BilingualText, ArabicHeading, ArabicParagraph } from '@/components/ArabicText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ArabicExample = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Language Toggle */}
        <div className="flex justify-center gap-4">
          <Button 
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button 
            variant={language === 'ar' ? 'default' : 'outline'}
            onClick={() => setLanguage('ar')}
          >
            العربية
          </Button>
        </div>

        {/* Bilingual Header */}
        <Card>
          <CardHeader>
            <CardTitle>
              <BilingualText
                english="Google Fonts Arabic Implementation"
                arabic="تطبيق خطوط جوجل العربية"
                language={language}
                as="h1"
                className="text-3xl font-bold"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BilingualText
              english="This page demonstrates the implementation of Google Fonts for Arabic text using the Cairo font family, while preserving the default fonts for English content."
              arabic="تعرض هذه الصفحة تطبيق خطوط جوجل للنصوص العربية باستخدام عائلة خط القاهرة، مع الحفاظ على الخطوط الافتراضية للمحتوى الإنجليزي."
              language={language}
              as="p"
              className="text-muted-foreground"
            />
          </CardContent>
        </Card>

        {/* Arabic Text Examples */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* English Card */}
          <Card>
            <CardHeader>
              <CardTitle>English Content (Default Fonts)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-semibold">Digital Agency Services</h2>
              <p className="leading-relaxed">
                We provide comprehensive digital marketing solutions including web development, 
                e-commerce platforms, SEO optimization, and social media marketing. Our team 
                specializes in creating modern, responsive websites that drive business growth.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Web Development & Design</li>
                <li>E-commerce Solutions</li>
                <li>Digital Marketing</li>
                <li>SEO & Content Strategy</li>
              </ul>
            </CardContent>
          </Card>

          {/* Arabic Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <ArabicText as="span">المحتوى العربي (خط القاهرة)</ArabicText>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ArabicHeading level={2}>
                خدمات الوكالة الرقمية
              </ArabicHeading>
              <ArabicParagraph>
                نقدم حلول تسويق رقمي شاملة تشمل تطوير المواقع الإلكترونية، منصات التجارة 
                الإلكترونية، تحسين محركات البحث، والتسويق عبر وسائل التواصل الاجتماعي. 
                يختص فريقنا في إنشاء مواقع حديثة ومتجاوبة تدفع نمو الأعمال.
              </ArabicParagraph>
              <ArabicText as="ul" className="list-disc list-inside space-y-2">
                <li>تطوير وتصميم المواقع</li>
                <li>حلول التجارة الإلكترونية</li>
                <li>التسويق الرقمي</li>
                <li>تحسين محركات البحث واستراتيجية المحتوى</li>
              </ArabicText>
            </CardContent>
          </Card>
        </div>

        {/* Font Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Font Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* English Font Stack */}
            <div>
              <h3 className="text-lg font-semibold mb-2">English Text (Tailwind Default)</h3>
              <p className="text-muted-foreground mb-2">
                Font Stack: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
              </p>
              <p className="text-xl">
                The quick brown fox jumps over the lazy dog. 1234567890
              </p>
            </div>

            {/* Arabic Font Stack */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Arabic Text (Cairo Font)</h3>
              <p className="text-muted-foreground mb-2">
                Font Stack: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
              </p>
              <ArabicText as="p" className="text-xl">
                نص تجريبي باللغة العربية باستخدام خط القاهرة. ١٢٣٤٥٦٧٨٩٠
              </ArabicText>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Method 1: Using lang attribute</h4>
                <code className="block bg-muted p-2 rounded text-sm mt-1">
                  {`<div lang="ar">النص العربي</div>`}
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold">Method 2: Using dir attribute</h4>
                <code className="block bg-muted p-2 rounded text-sm mt-1">
                  {`<div dir="rtl">النص العربي</div>`}
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold">Method 3: Using CSS classes</h4>
                <code className="block bg-muted p-2 rounded text-sm mt-1">
                  {`<div className="arabic-text">النص العربي</div>`}
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold">Method 4: Using ArabicText component</h4>
                <code className="block bg-muted p-2 rounded text-sm mt-1">
                  {`<ArabicText>النص العربي</ArabicText>`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ArabicExample;
