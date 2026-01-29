
import React from 'react';

const NavigatorX: React.FC = () => {
  // The full HTML provided by the user for NavigatorX
  const srcDoc = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Eco-index NavigatorX</title>
    <link href='https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css' rel='stylesheet' />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <style>
        body { margin: 0; font-family: Arial, sans-serif; overflow: hidden; }
        #navigator-embed { position: absolute; height: 100%; width: 100%; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        #control-panel { position: absolute; background: rgb(255, 255, 255); border-radius: 10px; top: 15px; left: 10px; padding: 10px; z-index: 1000; width: 347px; }
        .legend-header { display: flex; justify-content: space-between; align-items: center; }
        .legend-header p { margin-top: 10px; margin-bottom:16px; }
        .toggle-button { background: none; border: none; cursor: pointer; font-size: 16px; }
        .tab { box-shadow: inset 0px -10px 10px -10px rgba(0, 0, 0, 0.15); overflow: hidden; background-color: #f1f1f1; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: center; align-items: center; }
        .tab button { background-color: #f1f1f1; box-shadow: inset 0px -10px 10px -10px rgba(0, 0, 0, 0.15); border: none; outline: none; cursor: pointer; width:40%; height: 65px; border-top-left-radius: 8px; border-top-right-radius: 8px; margin:10px; margin-bottom: 0px; border: 1px solid #f1f1f1; border-bottom: none; }
        .tab button.active { background-color: #ffffff; box-shadow: none; }
        .tabcontent { display: none; padding: 6px 12px; border: 1px solid #f1f1f1; border-top: none; font-size: 13px; }
        .tabcontent div { position: relative; display: inline-block; width: 100%; }
        .info-icon { position: absolute; right: 0px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #7c7c7c; }
        #scale-container { position: absolute; background: white; border-radius: 10px; top: 15px; right: 10px; z-index: 1000; padding: 10px; width: 200px; }
        .ena-legend { position: absolute; top: 270px; right: 10px; background: white; padding: 10px; border-radius: 10px; z-index: 1000; display: none; width: 263px; }
        .ena-legend-item { display: flex; align-items: center; }
        .ena-legend-text { flex-grow: 1; text-align: left; padding:5px; }
        .ena-legend-color { width: 20px; height: 10px; margin-right: 5px; border-radius: 3px;}
        #overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1002; display: none; pointer-events: none; }
        #disclaimer { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); z-index: 1003; display: none; max-width: 90%; max-height: 90%; overflow: auto; }
        #accept-btn { background-color: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        #decline-btn { background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        #fullscreen-btn { position: absolute; bottom: 25px; right: 10px; padding: 10px; background-color: rgba(0, 0, 0, 0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .popup { display: none; position: absolute; background-color: white; border: 1px solid #c9c9c9; border-radius: 8px; max-width: 500px; box-shadow: 0 2px 15px rgba(0,0,0,.2); z-index: 1004; }
        .popup-content { padding: 10px; }
    </style>
</head>
<body>
    <div id="navigator-embed">
        <div id="overlay"></div>
        <div id="scale-container" class="reset">
            <div class="legend-header">
                <p><b>Reconstruction Opportunity Scale</b></p>
                <button id="toggle-scale-container" class="toggle-button"><i class="fas fa-minus"></i></button>
            </div>
            <div id="scale-container-content">
                <div id="reconstructionScale" class="scale"></div>
            </div>
        </div>
        <div id="ena-legend" class="ena-legend">
            <div class="legend-header">
                <p><b>Land Cover Snapshot</b></p>
                <button id="toggle-ena-legend" class="toggle-button"><i class="fas fa-minus"></i></button>
            </div>
            <div id="ena-legend-content">
                <div class="ena-legend-item">
                    <div class="ena-legend-color" style="background-color: rgb(255, 51, 0);"></div>
                    <div class="ena-legend-text">Built-up and Transport Areas</div><i class="fas fa-info-circle legend-info-icon" data-icon-id="Unavailable for Reconstruction"></i>
                </div>
                <div class="ena-legend-item">
                    <div class="ena-legend-color" style="background-color: rgb(201, 146, 34);"></div>
                    <div class="ena-legend-text">Regenerating Ecosystems</div><i class="fas fa-info-circle legend-info-icon" data-icon-id="Regenerating"></i>
                </div>
                <div class="ena-legend-item">
                    <div class="ena-legend-color" style="background-color: rgb(0, 122, 37);"></div>
                    <div class="ena-legend-text">Mature Ecosystems</div><i class="fas fa-info-circle legend-info-icon" data-icon-id="Mature"></i>
                </div>
                <div class="ena-legend-item">
                    <div class="ena-legend-color" style="background-color: rgb(37, 247, 48);"></div>
                    <div class="ena-legend-text">Reconstruction Opportunity</div><i class="fas fa-info-circle legend-info-icon" data-icon-id="Potentially Restorable"></i>
                </div>
            </div>
        </div>
        <div id='map'></div>
        <div><button id="fullscreen-btn"><i class="fas fa-expand"></i></button></div>
        <div id='control-panel'>
            <div class="legend-header">
                <p><b>Control Panel</b></p>
                <button id="toggle-control-panel" class="toggle-button"><i class="fas fa-minus"></i></button>
            </div>
            <div id="control-panel-content">
                <div class="tab">
                    <button id="tablink-reconstruction" class="tablinks"><strong>Prioritisation Options</strong></button>
                    <button id="tablink-reference" class="tablinks"><strong>Contextual Info</strong></button>
                </div>
                <div id="tab-reconstruction" class="tabcontent">
                    <div id="reconstructionToggles">
                        <div><input type='checkbox' id='togglePixelScore_connect' data-attribute="PixelScore_connect" checked><label>Connectivity Stepping Stones</label><i class="fas fa-info-circle info-icon" data-icon-id="Connectivity"></i></div>
                        <div><input type='checkbox' id='togglePixelScore_eco15boost' data-attribute="PixelScore_eco15boost" checked><label>Ecosystem 15% Cover Goal</label><i class="fas fa-info-circle info-icon" data-icon-id="eco15boost"></i></div>
                        <div><input type='checkbox' id='togglePixelScore_landstab' data-attribute="PixelScore_landstab" checked><label>Land Stability</label><i class="fas fa-info-circle info-icon" data-icon-id="Land_Stability"></i></div>
                        <div><input type='checkbox' id='togglePixelScore_threatenv' data-attribute="PixelScore_threatenv" checked><label>Threatened Environments</label><i class="fas fa-info-circle info-icon" data-icon-id="Threatened_Environment"></i></div>
                    </div>
                </div>
                <div id="tab-reference" class="tabcontent">
                    <div><input type='checkbox' id='togglemangaroa_property' checked><label>Mangaroa Property</label></div>
                    <div><input type='checkbox' id='toggleecoindex_land_cover_snapshot'><label>Land Cover Snapshot</label></div>
                    <div><input type="checkbox" id="heatmapToggle" checked><label>Satellite View</label></div>
                </div>
            </div>
        </div>
        <div id="info-popup" class="popup"><div class="popup-content"><div id="popup-text"></div></div></div>
        <div id="disclaimer">
            <h2>Welcome to Navigator X</h2>
            <p>Navigator X provides spatial guidance for ecosystem reconstruction. Use it to find optimal areas for restoration.</p>
            <div style="display:flex; justify-content:center; gap:10px; margin-top:20px;">
                <button id="accept-btn">Accept</button>
                <button id="decline-btn">Decline</button>
            </div>
        </div>
    </div>
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js"></script>
    <script>
        mapboxgl.accessToken='pk.eyJ1Ijoid3BlYXJzb24tbGl0bXVzIiwiYSI6ImNtMmF6MjN5dDBsbXIya3B6MjVidTE2NWUifQ.e9THdUrrIoG6lNYs1X7uag';
        const colorStops=[{value:1,color:'rgba(68, 1, 84, 0.55)'},{value:45,color:'rgba(247, 243, 60, 1.0)'}];
        let map=new mapboxgl.Map({container:'map',style:'mapbox://styles/wpearson-litmus/clvao8tps004201rd1ps2ctqm',center:[175.1,-41.12],zoom:11,pitch:45});
        map.on('load', () => {
            const disc = document.getElementById('disclaimer');
            disc.style.display = 'block';
            document.getElementById('accept-btn').onclick = () => disc.style.display = 'none';
            document.getElementById('decline-btn').onclick = () => window.location.reload();
            
            // Tab logic
            window.openTab = (evt, name) => {
                document.querySelectorAll('.tabcontent').forEach(c => c.style.display='none');
                document.querySelectorAll('.tablinks').forEach(l => l.classList.remove('active'));
                document.getElementById(name).style.display = 'block';
                evt.currentTarget.classList.add('active');
            };
            document.getElementById('tablink-reconstruction').onclick = (e) => openTab(e, 'tab-reconstruction');
            document.getElementById('tablink-reference').onclick = (e) => openTab(e, 'tab-reference');
            document.getElementById('tablink-reconstruction').click();

            // Simple drag placeholder
            const setupDrag = (id) => {
                const el = document.getElementById(id);
                el.onmousedown = (e) => {
                    let ox = e.clientX - el.offsetLeft;
                    let oy = e.clientY - el.offsetTop;
                    document.onmousemove = (me) => {
                        el.style.left = (me.clientX - ox) + 'px';
                        el.style.top = (me.clientY - oy) + 'px';
                    };
                    document.onmouseup = () => document.onmousemove = null;
                };
            };
            setupDrag('control-panel');
        });
    </script>
</body>
</html>
  `;

  return (
    <div className="w-full bg-white p-2 rounded-[28px] shadow-2xl border border-[#E5E1DD] overflow-hidden">
      <iframe
        title="Navigator X"
        srcDoc={srcDoc}
        className="w-full h-[700px] border-none rounded-[24px]"
        allow="fullscreen"
      />
    </div>
  );
};

export default NavigatorX;
