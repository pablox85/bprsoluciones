(function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var visionToggle = document.getElementById('vision-toggle');
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  var year = document.getElementById('current-year');
  var modeStatus = document.getElementById('mode-status');
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieAccept = document.getElementById('cookie-accept');
  var cookieReject = document.getElementById('cookie-reject');
  var leadForm = document.getElementById('lead-form');
  var formStatus = document.getElementById('form-status');
  var gaMeta = document.querySelector('meta[name="ga4-id"]');

  var CONSENT_KEY = 'bpr-cookie-consent';
  var gaId = gaMeta ? gaMeta.getAttribute('content') : '';

  if (year) year.textContent = String(new Date().getFullYear());

  function announce(message) {
    if (modeStatus) {
      modeStatus.textContent = message;
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      var active = theme === 'dark';
      var label = themeToggle.querySelector('.mode-btn-text');
      themeToggle.setAttribute('aria-pressed', String(active));
      themeToggle.setAttribute('aria-label', active ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      if (label) {
        label.textContent = active ? 'Oscuro' : 'Claro';
      }
    }
  }

  function applyVision(mode) {
    root.setAttribute('data-vision', mode);
    if (visionToggle) {
      var active = mode === 'colorblind';
      visionToggle.setAttribute('aria-pressed', String(active));
      visionToggle.textContent = active ? 'Color estandar' : 'Modo colorblind';
      visionToggle.setAttribute('aria-label', active ? 'Cambiar a paleta de color estandar' : 'Activar paleta de color amigable para daltonismo');
    }
  }

  function closeNav() {
    if (menuToggle && nav) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-open');
    }
  }

  function loadAnalytics() {
    if (!gaId || gaId === 'G-XXXXXXXXXX' || window.__bprGaLoaded) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });

    window.__bprGaLoaded = true;
  }

  function trackEvent(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  function setCookieBannerVisible(visible) {
    if (!cookieBanner) return;
    cookieBanner.classList.toggle('is-hidden', !visible);
  }

  function persistConsent(consentValue) {
    localStorage.setItem(CONSENT_KEY, consentValue);
    if (consentValue === 'accepted') {
      loadAnalytics();
      trackEvent('cookie_consent', { consent: 'accepted' });
    }
    setCookieBannerVisible(false);
  }

  function initConsent() {
    if (!cookieBanner) return;

    var consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadAnalytics();
      setCookieBannerVisible(false);
      return;
    }

    if (consent === 'rejected') {
      setCookieBannerVisible(false);
      return;
    }

    setCookieBannerVisible(true);
  }

  function initCtaTracking() {
    var trackedElements = document.querySelectorAll('[data-track]');
    trackedElements.forEach(function (element) {
      element.addEventListener('click', function () {
        var label = element.getAttribute('data-track') || 'cta';
        var eventName = 'cta_click';
        if (label.indexOf('email') !== -1) {
          eventName = 'click_email';
        } else if (label.indexOf('whatsapp') !== -1) {
          eventName = 'click_whatsapp';
        } else if (label.indexOf('calendar') !== -1) {
          eventName = 'click_calendar';
        }

        trackEvent(eventName, {
          cta_label: label,
          cta_text: (element.textContent || '').trim().slice(0, 80)
        });
      });
    });
  }

  function initIndustrySegment() {
    var buttons = document.querySelectorAll('[data-industry-btn]');
    var title = document.getElementById('industry-title');
    var intro = document.getElementById('industry-intro');
    var subtitle = document.getElementById('industry-subtitle');
    var points = document.getElementById('industry-points');
    var kpi = document.getElementById('industry-kpi');
    var whatsappLink = document.getElementById('industry-whatsapp');
    var leadIndustry = document.getElementById('lead-industry');

    if (!buttons.length || !title || !intro || !points || !kpi || !whatsappLink) return;

    var content = {
      industriales: {
        label: 'Empresas industriales',
        title: 'Empresas industriales: más cotizaciones y menos fricción comercial',
        intro: 'Implementación orientada a captación B2B*, seguimiento de oportunidades y respuesta rápida a consultas técnicas.',
        points: [
          'Formularios de cotización por línea de producto.',
          'Automatización de respuestas y derivación por tipo de consulta.',
          'SEO para búsquedas industriales con intención de compra.'
        ],
        kpi: 'Meta sugerida a 90 días: +35% de leads calificados.',
        subtitle: 'B2B (Business to Business) es un modelo donde una empresa vende productos o servicios a otra empresa.'
      },
      clinicas: {
        label: 'Centros esteticos',
        title: 'Centros esteticos: más turnos confirmados y mejor experiencia del paciente',
        intro: 'Optimización de adquisición digital, agenda y automatizaciones para reducir tiempos de respuesta.',
        points: [
          'Campañas por especialidad con páginas de alto rendimiento.',
          'Formularios y flujos para preclasificar consultas.',
          'Automatización de recordatorios para reducir ausentismo.'
        ],
        kpi: 'Meta sugerida a 90 días: +28% de reservas online.'
      },
      contables: {
        label: 'Estudios contables',
        title: 'Estudios contables: más consultas B2B y mejor ratio de cierre',
        intro: 'Estrategia de posicionamiento experto con foco en servicios de alto valor para empresas.',
        points: [
          'Landing por servicio clave: impuestos, sueldos y auditoría.',
          'Captación de leads con filtros por tamaño y urgencia.',
          'Respuesta automática y priorización comercial de oportunidades.'
        ],
        kpi: 'Meta sugerida a 90 días: +32% de consultas empresariales.',
        subtitle: 'B2B (Business to Business) es un modelo donde una empresa vende productos o servicios a otra empresa.'
      },
      constructoras: {
        label: 'Constructoras',
        title: 'Constructoras: generación de oportunidades para obras y proyectos',
        intro: 'Comunicación comercial enfocada en confianza técnica, cartera de proyectos y contacto directo.',
        points: [
          'Páginas por tipo de obra y segmento objetivo.',
          'Casos y avances para fortalecer credibilidad comercial.',
          'Canal directo para presupuestos y visitas técnicas.'
        ],
        kpi: 'Meta sugerida a 90 días: +40% de oportunidades calificadas.'
      }
    };

    function applyIndustry(industryKey) {
      var current = content[industryKey];
      if (!current) return;

      title.textContent = current.title;
      intro.textContent = current.intro;
      if (subtitle) subtitle.textContent = current.subtitle || '';
      points.innerHTML = current.points.map(function (item) { return '<li>' + item + '</li>'; }).join('');
      kpi.textContent = current.kpi;
      whatsappLink.href = 'https://wa.me/59891343651?text=' + encodeURIComponent('Hola BPR Soluciones, quiero una propuesta para ' + current.label.toLowerCase() + '.');
      if (leadIndustry) leadIndustry.value = current.label;
      window.__bprIndustryLabel = current.label;
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.setAttribute('aria-pressed', 'false');
          item.classList.remove('is-active');
        });

        button.setAttribute('aria-pressed', 'true');
        button.classList.add('is-active');
        applyIndustry(button.getAttribute('data-industry-btn'));
      });
    });

    applyIndustry('industriales');
  }

  function initLeadForm() {
    if (!leadForm || !formStatus) return;
    var LEAD_ENDPOINT = 'https://formsubmit.co/ajax/pdpcorrales@gmail.com';
    var submitButton = leadForm.querySelector('button[type="submit"]');
    var startTimeInput = document.getElementById('lead-start-time');
    var RATE_LIMIT_KEY = 'bpr-lead-last-submit';
    var MIN_FILL_MS = 4000;
    var MIN_INTERVAL_MS = 60000;

    if (startTimeInput) {
      startTimeInput.value = String(Date.now());
    }

    leadForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!leadForm.checkValidity()) {
        formStatus.textContent = 'Revisa los campos obligatorios antes de enviar.';
        return;
      }

      var data = new FormData(leadForm);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var phone = String(data.get('phone') || '').trim();
      var need = String(data.get('need') || '').trim();
      var budget = String(data.get('budget') || '').trim();
      var industry = String(data.get('industry') || '').trim();
      var company = String(data.get('company') || '').trim();
      var startedAt = Number(data.get('form_started_at') || 0);

      if (company) {
        formStatus.textContent = 'No pudimos validar el envío. Intenta nuevamente.';
        trackEvent('form_blocked_spam', { reason: 'honeypot' });
        return;
      }

      if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
        formStatus.textContent = 'Esperá unos segundos y volvé a enviar.';
        trackEvent('form_blocked_spam', { reason: 'too_fast' });
        return;
      }

      var lastSubmitAt = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
      if (lastSubmitAt && Date.now() - lastSubmitAt < MIN_INTERVAL_MS) {
        formStatus.textContent = 'Ya recibimos tu solicitud. Esperá 1 minuto para reenviar.';
        trackEvent('form_blocked_spam', { reason: 'rate_limit' });
        return;
      }

      trackEvent('generate_lead', {
        lead_need_length: need.length,
        lead_budget: budget
      });
      trackEvent('form_submit', { form_id: 'lead-form' });

      if (submitButton) submitButton.disabled = true;
      formStatus.textContent = 'Enviando propuesta...';

      var payload = {
        name: name,
        email: email,
        phone: phone,
        industry: industry,
        need: need,
        budget: budget,
        _subject: 'Nuevo lead web - ' + name + (industry ? ' (' + industry + ')' : ''),
        _captcha: 'true',
        _template: 'table'
      };

      fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('request_failed');
          }
          return response.json();
        })
        .then(function (result) {
          if (result && (result.success === 'true' || result.success === true)) {
            formStatus.textContent = 'Gracias. Tu propuesta fue enviada correctamente.';
            localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
            leadForm.reset();
            var leadIndustryInput = document.getElementById('lead-industry');
            if (leadIndustryInput && window.__bprIndustryLabel) {
              leadIndustryInput.value = window.__bprIndustryLabel;
            }
            if (startTimeInput) {
              startTimeInput.value = String(Date.now());
            }
            return;
          }
          throw new Error('delivery_failed');
        })
        .catch(function () {
          formStatus.textContent = 'No pudimos enviar tu propuesta. Intenta nuevamente en unos minutos.';
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

  var storedVision = localStorage.getItem('bpr-vision');
  applyTheme('dark');
  localStorage.setItem('bpr-theme', 'dark');
  applyVision(storedVision || 'default');
  initConsent();
  initCtaTracking();
  initIndustrySegment();
  initLeadForm();

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      persistConsent('accepted');
      announce('Cookies de medicion aceptadas');
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', function () {
      persistConsent('rejected');
      announce('Cookies de medicion rechazadas');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bpr-theme', next);
      applyTheme(next);
      announce(next === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado');
    });
  }

  if (visionToggle) {
    visionToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-vision');
      var next = current === 'colorblind' ? 'default' : 'colorblind';
      localStorage.setItem('bpr-vision', next);
      applyVision(next);
      announce(next === 'colorblind' ? 'Modo colorblind activado' : 'Modo colorblind desactivado');
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Cerrar menu');
      nav.classList.toggle('is-open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    document.addEventListener('click', function (event) {
      var isOpen = nav.classList.contains('is-open');
      if (!isOpen) return;
      var clickedInsideNav = nav.contains(event.target);
      var clickedMenuButton = menuToggle.contains(event.target);
      if (!clickedInsideNav && !clickedMenuButton) {
        closeNav();
      }
    });
  }

  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) {
        item.classList.add('in-view');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    }
  }
})();
