// تخزين الأسماء التي تم إرسالها
const submittedNames = JSON.parse(localStorage.getItem('submittedNames')) || [];

// تغيير الصور كل 1.5 ثانية مع تأثير السحب
const images = document.querySelectorAll('.club-image');
let currentImage = 0;
let isAnimating = false;
let direction = 1; // 1 لليمين، -1 لليسار

function changeImage() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    const activeImg = document.querySelector('.club-image.active');
    const nextImg = images[(currentImage + 1) % images.length];
    
    // تحديد اتجاه السحب بالتناوب
    if (direction === 1) {
        activeImg.style.animation = 'slideOutLeft 1.5s forwards';
        nextImg.style.animation = 'slideInRight 1.5s forwards';
    } else {
        activeImg.style.animation = 'slideOutRight 1.5s forwards';
        nextImg.style.animation = 'slideInLeft 1.5s forwards';
    }
    
    // تبديل الاتجاه للمرة القادمة
    direction *= -1;
    
    setTimeout(() => {
        activeImg.classList.remove('active');
        activeImg.style.animation = '';
        
        nextImg.classList.add('active');
        nextImg.style.animation = '';
        
        currentImage = (currentImage + 1) % images.length;
        isAnimating = false;
    }, 1500);
}

// بدء التبديل التلقائي
let slideInterval = setInterval(changeImage, 1500);

// إيقاف التبديل التلقائي عند التفاعل مع الصور (اختياري)
document.querySelector('.image-container').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.image-container').addEventListener('mouseleave', () => {
    slideInterval = setInterval(changeImage, 1500);
});

// تأثير ثلاثي الأبعاد عند حركة الماوس
const card = document.querySelector('.card');

document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

document.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

// منع النسخ والتحميل
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)) {
        e.preventDefault();
    }
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74))) {
        e.preventDefault();
    }
});

// إرسال النموذج
const form = document.getElementById('clubForm');
const mainCard = document.getElementById('mainCard');
const successPage = document.getElementById('successPage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const fullName = `${name}_${nickname}`;
    
    // التحقق إذا كان الاسم قد تم إرساله مسبقاً
    if (submittedNames.includes(fullName)) {
        errorMessage.textContent = "لقد قمت بالتسجيل سابقاً بنفس الاسم واللقب";
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
        return;
    }
    
    // إضافة الاسم إلى القائمة وحفظها في localStorage
    submittedNames.push(fullName);
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames));
    
    // إرسال النموذج باستخدام Fetch API
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // إخفاء النموذج الرئيسي
            mainCard.style.display = 'none';
            
            // إظهار صفحة النجاح
            successPage.style.display = 'block';
            
            // التمرير إلى صفحة النجاح
            window.location.hash = '#successPage';
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى');
    });
});

// التحقق من وجود hash في URL عند تحميل الصفحة
window.addEventListener('load', function() {
    if (window.location.hash === '#successPage') {
        mainCard.style.display = 'none';
        successPage.style.display = 'block';
    }
});