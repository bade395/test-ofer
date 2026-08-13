document.addEventListener('DOMContentLoaded', () => {
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const quoteRefInput = document.getElementById('quote-ref');

    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', async () => {
            const element = document.getElementById('document-to-pdf');
            const refVal = quoteRefInput ? quoteRefInput.value || 'Quotation' : 'Quotation';
            
            btnExportPdf.innerText = 'جاري التحميل...';
            btnExportPdf.disabled = true;

            // إضافة كلاس التصدير لتهيئته للطباعة
            document.body.classList.add('rendering-pdf');

            // التأكد من اكتمال تحميل الخطوط
            if (document.fonts) {
                await document.fonts.ready;
            }

            // إعدادات تصدير هامة لمنع الهوامش والصفحات الفارغة
            const opt = {
                margin:       0,
                filename:     `عرض_سعر_${refVal}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    letterRendering: true,
                    windowWidth: 794, // 210mm بكسل مقاس A4 القياسي لضمان عدم وجود مساحات بيضاء جانبية
                    scrollY: 0,
                    scrollX: 0
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
                pagebreak:    { mode: ['css', 'legacy'] }
            };

            try {
                await html2pdf().set(opt).from(element).save();
            } catch (err) {
                console.error(err);
                alert('حدث خطأ أثناء تنزيل الملف، يرجى المحاولة مرة أخرى.');
            } finally {
                document.body.classList.remove('rendering-pdf');
                btnExportPdf.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> تصدير PDF`;
                btnExportPdf.disabled = false;
            }
        });
    }
});
