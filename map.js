// ==========================================
// 72H Tokyo - Interactive Itinerary Map (Ultimate Stable & Responsive Edition)
// 支援維基共享圖庫無限視角、深色模式與手機端自適應
// ==========================================

// --- 1. 動態注入手機端自適應 CSS (修復地圖塌陷問題) ---
var mapStyles = document.createElement('style');
mapStyles.innerHTML = `
  /* 修正：恢復固定高度，把被壓扁的軍用餅乾撐開！ */
  #tokyo-topology-map { width: 100%; height: 720px; z-index: 1; border-radius: 12px; }
  
  .popup-img-wrapper { position: relative; width: 100%; height: 140px; background: #222; border-radius: 8px; overflow: hidden; margin-bottom: 8px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
  .popup-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
  .popup-img-loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #aaa; font-size: 12px; pointer-events: none; }
  .popup-img-hint { position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 4px; pointer-events: none; backdrop-filter: blur(4px); }
  
  /* 圖例卡片樣式 */
  .map-legend-box { background: rgba(30, 30, 30, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); font-family: sans-serif; font-size: 13px; color: #eee; min-width: 160px; pointer-events: auto; }
  .map-legend-box b { display: block; margin-bottom: 12px; font-size: 14px; color: #fff; }
  .map-legend-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  
  /* 手機端深度自適應 (Max-width: 640px) */
  @media (max-width: 640px) {
    /* 確保手機版地圖依然有足夠高度 */
    #tokyo-topology-map { height: 480px !important; }
    
    /* 縮小 Popup 避免超出螢幕邊界 */
    .leaflet-popup-content { width: 240px !important; margin: 12px !important; }
    .popup-img-wrapper { height: 120px; }
    
    /* 右上角圖層控制器縮小 */
    .leaflet-control-layers { max-width: 160px; font-size: 12px; }
    
    /* 右下角圖例縮小，並拉開與底部的距離避免被切斷 */
    .leaflet-bottom.leaflet-right { bottom: 20px; right: 10px; transform: scale(0.9); transform-origin: bottom right; }
    .map-legend-box { padding: 12px; min-width: 140px; font-size: 11px; }
    .map-legend-box b { font-size: 12px; margin-bottom: 8px; }
  }
`;
document.head.appendChild(mapStyles);

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

// --- 2. 核心功能：維基共享資源 (Wikimedia Commons) 隨機圖片引擎 ---
window.fetchWikiImage = function(locId, searchKeyword) {
  var imgEl = document.getElementById('img-' + locId);
  if (!imgEl) return;
  
  imgEl.style.opacity = '0.3'; 
  
  var url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + 
            encodeURIComponent(searchKeyword) + 
            '&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*';
  
  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) {
       if (data.query && data.query.pages) {
         var pages = Object.values(data.query.pages);
         var validPages = pages.filter(function(p) { 
             return p.imageinfo && p.imageinfo[0] && p.imageinfo[0].thumburl && 
                    !p.imageinfo[0].thumburl.toLowerCase().endsWith('.svg.png') &&
                    !p.imageinfo[0].thumburl.toLowerCase().endsWith('.pdf');
         });
         
         if (validPages.length > 0) {
             var randomPage = validPages[Math.floor(Math.random() * validPages.length)];
             imgEl.src = randomPage.imageinfo[0].thumburl;
         } else {
             imgEl.src = 'https://picsum.photos/400/250?random=' + Math.random();
         }
       } else {
         imgEl.src = 'https://picsum.photos/400/250?random=' + Math.random();
       }
       imgEl.style.opacity = '1';
    })
    .catch(function(err) {
       imgEl.src = 'https://picsum.photos/400/250?random=' + Math.random();
       imgEl.style.opacity = '1';
    });
};

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function() {
    var mapEl = document.getElementById('tokyo-topology-map');
    if (!mapEl || typeof L === 'undefined') return;

    var map = L.map('tokyo-topology-map', {
      scrollWheelZoom: true, zoomControl: true, worldCopyJump: true
    }).setView(tokyoCenter, defaultZoom);
    window._tokyoMap = map;

    // 暗黑模式底圖
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri', maxNativeZoom: 16, maxZoom: 19
    }).addTo(map);

    // 暗黑模式地名標籤
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 16, maxZoom: 19
    }).addTo(map);

    var routeLayer = L.layerGroup().addTo(map);
    var mainMarkerLayer = L.layerGroup().addTo(map);
    var optionalMarkerLayer = L.layerGroup(); 
    var legendNode = null;

    var colors = {
      day1: '#40C4FF', day2: '#FF6E40', day3: '#B0BEC5', 
      shrine: '#FF5252', temple: '#B388FF', landmark: '#448AFF',
      transit: '#90A4AE', base: '#FFD740', food: '#FFAB40'
    };

    var markerLetters = {
      'zh-Hant': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
      'zh-Hans': { shrine: '社', temple: '寺', base: '基', transit: '交', food: '食', landmark: '景' },
      en: { shrine: 'S', temple: 'T', base: 'B', transit: 'M', food: 'F', landmark: 'L' }
    };

    var locations = [
      { id: 'nrt', coords: [35.7719, 140.3929], type: 'transit', dayKey: 'day1day3', wikiKey: 'Narita International Airport', name: t('成田機場 NRT', '成田机场 NRT', 'Narita Airport NRT'), summary: t('Skyliner 高速門戶。') },
      { id: 'nippori', coords: [35.7278, 139.7708], type: 'transit', dayKey: 'day1day3', wikiKey: 'Nippori Station', name: t('日暮里站', '日暮里站', 'Nippori Sta.'), summary: t('轉乘節點。') },
      { id: 'akiba', coords: [35.6984, 139.7730], type: 'base', dayKey: 'day13', wikiKey: 'Akihabara', name: t('秋葉原基地', '秋叶原基地', 'Akihabara Base'), summary: t('72 小時動線核心。') },
      { id: 'kanda', coords: [35.7017, 139.7679], type: 'shrine', dayKey: 'day1', wikiKey: 'Kanda Shrine Tokyo', name: t('神田明神', '神田明神', 'Kanda Myojin'), summary: t('動漫與傳統信仰並置。') },
      { id: 'sensoji', coords: [35.7148, 139.7967], type: 'temple', dayKey: 'day2am', wikiKey: 'Senso-ji', name: t('淺草寺・雷門', '浅草寺・雷门', 'Senso-ji Temple'), summary: t('東京最具代表性的古寺。') },
      { id: 'asakusa-shrine', coords: [35.7155, 139.7974], type: 'shrine', dayKey: 'day2am', wikiKey: 'Asakusa Shrine', name: t('淺草神社', '浅草神社', 'Asakusa Shrine'), summary: t('神佛習合主題。') },
      { id: 'skytree', coords: [35.7101, 139.8107], type: 'landmark', dayKey: 'optional', wikiKey: 'Tokyo Skytree', name: t('東京晴空塔', '东京晴空塔', 'Tokyo Skytree'), summary: t('東東京天際線。') },
      { id: 'ueno', coords: [35.7156, 139.7732], type: 'landmark', dayKey: 'day2noon', wikiKey: 'Ueno Park', name: t('上野公園', '上野公园', 'Ueno Park'), summary: t('文化與庶民的交會點。') },
      { id: 'ueno-toshogu', coords: [35.7151, 139.7707], type: 'shrine', dayKey: 'day2noon', wikiKey: 'Ueno Toshogu', name: t('上野東照宮', '上野东照宮', 'Ueno Toshogu'), summary: t('金色社殿。') },
      { id: 'ameyoko', coords: [35.7101, 139.7744], type: 'food', dayKey: 'day2noon', wikiKey: 'Ameya-Yokochō', name: t('阿美橫丁', '阿美横丁', 'Ameyoko Market'), summary: t('海鮮丼與街頭補給。') },
      { id: 'meiji', coords: [35.6764, 139.6993], type: 'shrine', dayKey: 'day2pm', wikiKey: 'Meiji Shrine', name: t('明治神宮', '明治神宮', 'Meiji Jingu'), summary: t('原宿旁的鎮守之森。') },
      { id: 'harajuku', coords: [35.6702, 139.7027], type: 'landmark', dayKey: 'day2pm', wikiKey: 'Harajuku', name: t('原宿', '原宿', 'Harajuku'), summary: t('文化緩衝帶。') },
      { id: 'takeshita', coords: [35.6717, 139.7020], type: 'landmark', dayKey: 'day2pm', wikiKey: 'Takeshita Street', name: t('竹下通', '竹下通', 'Takeshita St.'), summary: t('山手潮流入口。') },
      { id: 'shibuya', coords: [35.6595, 139.7005], type: 'landmark', dayKey: 'day2eve', wikiKey: 'Shibuya Crossing', name: t('澀谷十字路口', '涩谷十字路口', 'Shibuya Crossing'), summary: t('現代東京的霓虹心臟。') },
      { id: 'shinjuku', coords: [35.6950, 139.7036], type: 'landmark', dayKey: 'day2night', wikiKey: 'Kabukichō', name: t('新宿歌舞伎町', '新宿歌舞伎町', 'Shinjuku Kabukicho'), summary: t('不夜城與霓虹高峰。') },
      { id: 'tokyo-tower', coords: [35.6586, 139.7454], type: 'landmark', dayKey: 'optional', wikiKey: 'Tokyo Tower', name: t('東京鐵塔', '东京鐵塔', 'Tokyo Tower'), summary: t('昭和東京的紅白天際線。') }
    ];

    var locationById = {};
    locations.forEach(function (loc) { locationById[loc.id] = loc; });

    var itineraryRoutes = [
      { labels: t('Day 1 抵達線', 'Day 1 抵达线', 'Day 1 Arrival'), color: colors.day1, dashArray: null, points: ['nrt', 'nippori', 'akiba', 'kanda'] },
      { labels: t('Day 2 線香到霓虹', 'Day 2 线香到霓虹', 'Day 2 Route'), color: colors.day2, dashArray: null, points: ['akiba', 'sensoji', 'asakusa-shrine', 'ueno', 'ueno-toshogu', 'ameyoko', 'meiji', 'harajuku', 'shibuya', 'shinjuku'] },
      { labels: t('Day 3 撤退線', 'Day 3 撤退线', 'Day 3 Departure'), color: colors.day3, dashArray: '8, 8', points: ['akiba', 'ueno', 'nippori', 'nrt'] }
    ];

    function markerIcon(loc, lang) {
      var color = colors[loc.type] || colors.landmark;
      var label = (markerLetters[lang] && markerLetters[lang][loc.type]) || markerLetters['zh-Hant'][loc.type] || 'L';
      var isOptional = loc.dayKey === 'optional' || loc.dayKey === 'anchor';
      var size = isOptional ? 22 : 28;
      
      var html = '<div style="' +
        'background-color:' + color + '; color:#1a1a1a; width:' + size + 'px; height:' + size + 'px;' +
        'border-radius:50%; display:flex; align-items:center; justify-content:center;' +
        'font-size:' + (isOptional ? 11 : 14) + 'px; font-weight:900; font-family:sans-serif;' +
        'border:2px solid #ffffff; box-shadow: 0 0 10px ' + color + 'aa, 0 4px 6px rgba(0,0,0,0.5);' + 
        '">' + label + '</div>';

      return L.divIcon({ html: html, className: 'custom-bullet-icon', iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -size/2] });
    }

    function popupFor(loc, lang) {
      return '<div class="custom-popup-container" data-locid="' + loc.id + '" data-wikikey="' + loc.wikiKey + '" style="font-family:sans-serif;">' +
        '<div class="popup-img-wrapper" onclick="window.fetchWikiImage(\'' + loc.id + '\', \'' + loc.wikiKey + '\')" style="cursor:pointer;">' +
           '<div class="popup-img-loading">📷 載入實景中...</div>' +
           '<img id="img-' + loc.id + '" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="">' +
           '<div class="popup-img-hint">👆 點擊換視角</div>' +
        '</div>' +
        '<strong style="display:flex; align-items:center; gap:6px; font-size:15px; color:#222; margin-bottom:4px;">' + 
          '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:' + (colors[loc.type] || colors.landmark) + ';"></span>' + 
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
          icon: markerIcon(loc, lang), title: pick(loc.name, lang)
        }).bindPopup(popupFor(loc, lang));

        if (loc.dayKey === 'optional' || loc.dayKey === 'anchor') marker.addTo(optionalMarkerLayer);
        else marker.addTo(mainMarkerLayer);
      });
    }

    map.on('popupopen', function(e) {
       var container = e.popup.getElement().querySelector('.custom-popup-container');
       if (container) {
           var locId = container.getAttribute('data-locid');
           var wikiKey = container.getAttribute('data-wikikey');
           var imgEl = document.getElementById('img-' + locId);
           if (imgEl && imgEl.src.indexOf('data:image/gif') !== -1) {
               window.fetchWikiImage(locId, wikiKey);
           }
       }
    });

    function renderRoutes(lang) {
      routeLayer.clearLayers();

      itineraryRoutes.forEach(function (route) {
        var waypoints = route.points.map(function (id) { return locationById[id].coords[1] + ',' + locationById[id].coords[0]; }).join(';');
        var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + waypoints + '?overview=full&geometries=geojson';

        fetch(osrmUrl)
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data.routes && data.routes.length > 0) {
              L.geoJSON(data.routes[0].geometry, {
                style: { color: route.color, weight: 5, opacity: 0.9, dashArray: route.dashArray, lineCap: 'round', lineJoin: 'round' }
              }).bindTooltip(pick(route.labels, lang), { sticky: true }).addTo(routeLayer);
            } else { drawStraightLinesFallback(route, lang); }
          })
          .catch(function(err) { drawStraightLinesFallback(route, lang); });
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
        '<div class="map-legend-box">' +
          '<b>' + heading + '</b>' +
          '<div class="map-legend-row">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day1 + '; box-shadow: 0 0 6px ' + colors.day1 + ';"></span> Day 1' +
          '</div>' +
          '<div class="map-legend-row">' +
            '<span style="width:20px; height:4px; border-radius:2px; background:' + colors.day2 + '; box-shadow: 0 0 6px ' + colors.day2 + ';"></span> Day 2' +
          '</div>' +
          '<div class="map-legend-row">' +
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
    overlayMaps[currentLang === 'zh-Hant' ? "📍 72H 主線行程" : "📍 Main Route"] = mainMarkerLayer;
    overlayMaps[currentLang === 'zh-Hant' ? "🗺️ 延伸地標 (展開)" : "🗺️ Optional Spots"] = optionalMarkerLayer;

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
