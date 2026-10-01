// ==========================================
// 72H Tokyo - Interactive Itinerary Map (Neon & AI Photo Edition)
// 支援即時實景生成、無限視角切換與深色模式
// ==========================================

var tokyoCenter = [35.6950, 139.7550]; 
var defaultZoom = 12;

function returnToTokyo() {
  if (!window._tokyoMap) return;
  window._tokyoMap.closePopup();
  window._tokyoMap.flyTo(tokyoCenter, defaultZoom, { animate: true, duration: 1.35 });
}

function t(zh, zhs, en, vi, id, ja, ko) {
  return { 'zh-Hant': zh, 'zh-Hans': zhs, en: en, vi: vi, id: id, ja: ja, ko: ko };
}

function readMapLang() {
  var lang = document.documentElement.lang || 'zh-Hant';
  if (lang === 'zh-Hans') return 'zh-Hans';
  if (lang === 'zh-Hant' || lang.indexOf('zh') === 0) return 'zh-Hant';
  if (['en', 'vi', 'id', 'ja', 'ko'].indexOf(lang) >= 0) return lang;
  return 'en';
}

function pick(value, lang) {
  return value[lang] || value.en || value['zh-Hant'] || '';
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function() {
    var mapEl = document.getElementById('tokyo-topology-map');
    if (!mapEl) {
      console.error('tokyo-topology-map element not found!');
      return;
    }
    
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded!');
        return;
    }

    var map = L.map('tokyo-topology-map', {
      scrollWheelZoom: true,
      zoomControl: true,
      worldCopyJump: true
    }).setView(tokyoCenter, defaultZoom);
    window._tokyoMap = map;

    // 底層地圖 (深色模式)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxNativeZoom: 16,
      maxZoom: 19
    }).addTo(map);

    // 頂層地名標籤
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 16,
      maxZoom: 19
    }).addTo(map);

    var routeLayer = L.layerGroup().addTo(map);
    var mainMarkerLayer = L.layerGroup().addTo(map);
    var optionalMarkerLayer = L.layerGroup(); 
    var legendNode = null;

    var colors = {
      day1: '#40C4FF', 
      day2: '#FF6E40', 
      day3: '#B0BEC5', 
      shrine: '#FF5252',
      temple: '#B388FF',
      landmark: '#448AFF',
      transit: '#90A4AE',
      base: '#FFD740', 
      food: '#FFAB40',
      macro: '#D4AF37'
    };

    var markerLetters = {
      'zh-Hant': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
      'zh-Hans': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
      en: { shrine: 'S', temple: 'T', base: 'B', transit: 'M', food: 'F', landmark: 'L' }
    };

    // ✨ 更新圖庫關鍵字：優化為 AI 實景生成的精準提示詞 (Prompt)
    var locations = [
      { id: 'nrt', coords: [35.7719, 140.3929], type: 'transit', dayKey: 'day1day3', imgTag: 'Narita Airport Tokyo', name: t('成田機場 NRT', '成田机场 NRT', 'Narita Airport NRT'), summary: t('Skyliner 高速門戶。') },
      { id: 'nippori', coords: [35.7278, 139.7708], type: 'transit', dayKey: 'day1day3', imgTag: 'Nippori Station Tokyo train', name: t('日暮里站', '日暮里站', 'Nippori Sta.'), summary: t('轉乘節點。') },
      { id: 'akiba', coords: [35.6984, 139.7730], type: 'base', dayKey: 'day13', imgTag: 'Akihabara Tokyo neon street', name: t('秋葉原基地', '秋叶原基地', 'Akihabara Base'), summary: t('72 小時動線核心。') },
      { id: 'kanda', coords: [35.7017, 139.7679], type: 'shrine', dayKey: 'day1', imgTag: 'Kanda Myojin Shrine Tokyo', name: t('神田明神', '神田明神', 'Kanda Myojin'), summary: t('動漫與傳統信仰並置。') },
      { id: 'sensoji', coords: [35.7148, 139.7967], type: 'temple', dayKey: 'day2am', imgTag: 'Sensoji Temple Kaminarimon Tokyo', name: t('淺草寺・雷門', '浅草寺・雷门', 'Senso-ji Temple'), summary: t('東京最具代表性的古寺。') },
      { id: 'asakusa-shrine', coords: [35.7155, 139.7974], type: 'shrine', dayKey: 'day2am', imgTag: 'Asakusa Shrine Tokyo', name: t('淺草神社', '浅草神社', 'Asakusa Shrine'), summary: t('神佛習合主題。') },
      { id: 'skytree', coords: [35.7101, 139.8107], type: 'landmark', dayKey: 'optional', imgTag: 'Tokyo Skytree architecture', name: t('東京晴空塔', '东京晴空塔', 'Tokyo Skytree'), summary: t('東東京天際線。') },
      { id: 'ueno', coords: [35.7156, 139.7732], type: 'landmark', dayKey: 'day2noon', imgTag: 'Ueno Park Tokyo', name: t('上野公園', '上野公园', 'Ueno Park'), summary: t('文化與庶民的交會點。') },
      { id: 'ueno-toshogu', coords: [35.7151, 139.7707], type: 'shrine', dayKey: 'day2noon', imgTag: 'Ueno Toshogu Shrine Tokyo gold', name: t('上野東照宮', '上野东照宮', 'Ueno Toshogu'), summary: t('金色社殿。') },
      { id: 'ameyoko', coords: [35.7101, 139.7744], type: 'food', dayKey: 'day2noon', imgTag: 'Ameyoko Market Tokyo street food', name: t('阿美橫丁', '阿美横丁', 'Ameyoko Market'), summary: t('海鮮丼與街頭補給。') },
      { id: 'meiji', coords: [35.6764, 139.6993], type: 'shrine', dayKey: 'day2pm', imgTag: 'Meiji Jingu Shrine Tokyo forest', name: t('明治神宮', '明治神宮', 'Meiji Jingu'), summary: t('原宿旁的鎮守之森。') },
      { id: 'harajuku', coords: [35.6702, 139.7027], type: 'landmark', dayKey: 'day2pm', imgTag: 'Harajuku Tokyo street fashion', name: t('原宿', '原宿', 'Harajuku'), summary: t('文化緩衝帶。') },
      { id: 'takeshita', coords: [35.6717, 139.7020], type: 'landmark', dayKey: 'day2pm', imgTag: 'Takeshita Street Harajuku Tokyo', name: t('竹下通', '竹下通', 'Takeshita St.'), summary: t('山手潮流入口。') },
      { id: 'shibuya', coords: [35.6595, 139.7005], type: 'landmark', dayKey: 'day2eve', imgTag: 'Shibuya Crossing Tokyo neon night', name: t('澀谷十字路口', '涩谷十字路口', 'Shibuya Crossing'), summary: t('現代東京的霓虹心臟。') },
      { id: 'shinjuku', coords: [35.6950, 139.7036], type: 'landmark', dayKey: 'day2night', imgTag: 'Kabukicho Shinjuku Tokyo neon night', name: t('新宿歌舞伎町', '新宿歌舞伎町', 'Shinjuku Kabukicho'), summary: t('不夜城與霓虹高峰。') },
      { id: 'tokyo-tower', coords: [35.6586, 139.7454], type: 'landmark', dayKey: 'optional', imgTag: 'Tokyo Tower night', name: t('東京鐵塔', '东京鐵塔', 'Tokyo Tower'), summary: t('昭和東京的紅白天際線。') }
    ];

    var locationById = {};
    locations.forEach(function (loc) { locationById[loc.id] = loc; });

    var itineraryRoutes = [
      { labels: t('Day 1 抵達線', 'Day 1 抵达线', 'Day 1 Arrival'), color: colors.day1, dashArray: null, points: ['nrt', 'nippori', 'akiba', 'kanda'] },
      { labels: t('Day 2 線香到霓虹', 'Day 2 线香到霓虹', 'Day 2 Route'), color: colors.day2, dashArray: null, points: ['akiba', 'sensoji', 'asakusa-shrine', 'ueno', 'ueno-toshogu', 'ameyoko', 'meiji', 'harajuku', 'shibuya', 'shinjuku'] },
      { labels: t('Day 3 撤退線', 'Day 3 撤退线', 'Day 3 Departure'), color: colors.day3, dashArray: '8, 8', points: ['akiba', 'ueno', 'nippori', 'nrt'] }
    ];

    function getTypeColor(type) { return colors[type] || colors.landmark; }

    function markerIcon(loc, lang) {
      var color = getTypeColor(loc.type);
      var label = (markerLetters[lang] && markerLetters[lang][loc.type]) || markerLetters['zh-Hant'][loc.type] || 'L';
      var isOptional = loc.dayKey === 'optional' || loc.dayKey === 'anchor';
      var size = isOptional ? 22 : 28;
      
      var html = '<div style="' +
        'background-color:' + color + ';' +
        'color:#1a1a1a;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'border-radius:50%;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'font-size:' + (isOptional ? 11 : 14) + 'px;' +
        'font-weight:900;' +
        'font-family:sans-serif;' +
        'border:2px solid #ffffff;' +
        'box-shadow: 0 0 10px ' + color + 'aa, 0 4px 6px rgba(0,0,0,0.5);' + 
        '">' + label + '</div>';

      return L.divIcon({ html: html, className: 'custom-bullet-icon', iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -size/2] });
    }

    // ✨ 創新核心：Pollinations.ai 動態攝影生成 (保證不破圖，每次點擊角度皆不同)
    function popupFor(loc, lang) {
      var seed = Math.floor(Math.random() * 100000); // 隨機亂數種子，決定照片視角
      // 組合提示詞，確保生成風格為高畫質實景攝影
      var prompt = encodeURIComponent(loc.imgTag + ', realistic photography, 8k, highly detailed, beautiful');
      var imgUrl = 'https://image.pollinations.ai/prompt/' + prompt + '?width=400&height=250&nologo=true&seed=';
      
      return '<div style="font-family:sans-serif; width: 220px;">' +
        '<div style="position: relative; overflow: hidden; border-radius: 8px; margin-bottom: 8px; background: #222; min-height: 130px;">' +
           // 加入載入中的備用文字與顏色，以及圖片讀取失敗時的終極防禦 (Picsum 隨機風景)
           '<img src="' + imgUrl + seed + '" ' +
                'onclick="this.src=\'' + imgUrl + '\' + Math.floor(Math.random()*100000)" ' +
                'style="width: 100%; height: 130px; object-fit: cover; cursor: pointer; transition: 0.3s; color:#fff; text-align:center; line-height:130px; font-size:12px;" ' +
                'title="點擊切換不同視角/圖片" alt="AI實景繪製中..." ' +
                'onerror="this.src=\'https://picsum.photos/seed/\'+Math.floor(Math.random()*1000)+\'/400/250\'" />' +
           '<div style="position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; pointer-events: none; backdrop-filter:blur(4px);">👆 點圖切換視角</div>' +
        '</div>' +
        '<strong style="display:flex; align-items:center; gap:6px; font-size:15px; color:#222; margin-bottom:4px;">' + 
          '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:' + getTypeColor(loc.type) + ';"></span>' + 
          pick(loc.name, lang) + 
        '</strong>' +
        '<span style="display:block; font-size:12px; color:#666; line-height: 1.4;">' + pick(loc.summary, lang) + '</span>' +
      '</div>';
    }

    function renderMarkers(lang) {
      mainMarkerLayer.clearLayers();
      optionalMarkerLayer.clearLayers();

      locations.forEach(function (loc) {
        var marker = L.marker(loc.coords, {
          icon: markerIcon(loc, lang),
          title: pick(loc.name, lang)
        }).bindPopup(popupFor(loc, lang), { maxWidth: 240, minWidth: 220 });

        if (loc.dayKey === 'optional' || loc.dayKey === 'anchor') marker.addTo(optionalMarkerLayer);
        else marker.addTo(mainMarkerLayer);
      });
    }

    function renderRoutes(lang) {
      routeLayer.clearLayers();

      itineraryRoutes.forEach(function (route) {
        var waypoints = route.points.map(function (id) {
          var c = locationById[id].coords;
          return c[1] + ',' + c[0]; 
        }).join(';');

        var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + waypoints + '?overview=full&geometries=geojson';

        fetch(osrmUrl)
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data.routes && data.routes.length > 0) {
              var routeGeoJSON = data.routes[0].geometry;
              L.geoJSON(routeGeoJSON, {
                style: {
                  color: route.color,
                  weight: 5,
                  opacity: 0.9, 
                  dashArray: route.dashArray,
                  lineCap: 'round',
                  lineJoin: 'round'
                }
              }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
            } else {
              drawStraightLinesFallback(route, lang);
            }
          })
          .catch(function(err) {
            drawStraightLinesFallback(route, lang);
          });
      });

      function drawStraightLinesFallback(route, lang) {
        var latLngs = route.points.map(function (id) { return locationById[id].coords; });
        L.polyline(latLngs, {
          color: route.color, weight: 5, opacity: 0.9, dashArray: route.dashArray, lineCap: 'round', lineJoin: 'round'
        }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
      }
    }

    function updateLegend(lang) {
      if (!legendNode) return;
      var heading = pick({ 'zh-Hant': '72 小時路線圖例', 'zh-Hans': '72 小时路线图例', en: 'Map Legend' }, lang);
      
      legendNode.innerHTML =
        '<div style="background:rgba(20, 20, 20, 0.85); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; box-shadow:0 8px 24px rgba(0,0,0,0.5); font-family:sans-serif; font-size:13px; color:#eee; min-width:160px; pointer-events:auto;">' +
          '<b style="display:block; margin-bottom:12px; font-size:14px; color:#fff;">' + heading + '</b>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day1 + '; box-shadow: 0 0 6px ' + colors.day1 + ';"></span> Day 1' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day2 + '; box-shadow: 0 0 6px ' + colors.day2 + ';"></span> Day 2' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
            '<span style="width:20px; height:2px; border-top:3px dashed ' + colors.day3 + ';"></span> Day 3' +
          '</div>' +
        '</div>';
    }

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      legendNode = L.DomUtil.create('div');
      L.DomEvent.disableClickPropagation(legendNode);
      updateLegend(readMapLang());
      return legendNode;
    };
    legend.addTo(map);

    var baseMaps = {};
    var overlayMaps = {};
    var currentLang = readMapLang();
    var mainRouteLabel = currentLang === 'zh-Hant' ? "📍 72H 主線行程" : "📍 Main Route";
    var optionalLabel = currentLang === 'zh-Hant' ? "🗺️ 延伸地標 (展開)" : "🗺️ Optional Spots";
    
    overlayMaps[mainRouteLabel] = mainMarkerLayer;
    overlayMaps[optionalLabel] = optionalMarkerLayer;

    L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'topright' }).addTo(map);

    renderMapLanguage(readMapLang());

    function renderMapLanguage(lang) {
      renderMarkers(lang);
      renderRoutes(lang);
      updateLegend(lang);
    }

    document.addEventListener('tokyo:language-change', function (event) {
      var nextLang = event.detail && event.detail.lang ? event.detail.lang : readMapLang();
      if (nextLang === 'zh-Hans') nextLang = 'zh-Hans';
      else if (nextLang.indexOf('zh') === 0) nextLang = 'zh-Hant';
      renderMapLanguage(nextLang);
    });

  }, 200);
});
