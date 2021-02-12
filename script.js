window.onload = init;

function init() {
    const centerCoordinates = [31.2118063, 29.9870753];
    const map = new ol.Map({
        view: new ol.View({
            center: centerCoordinates,
            zoom: 0,
            // extent: [11644482.371265175, -5927677.981920381, 17897308.66780227, 423055.8371644793]
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "openlayers-map"
    })
// rgb(0, 208, 255)
// geoJSON
    const citiesStyle = function(feature) {
        let cityID = feature.get('ID');
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [0, 0, 0, 0.6]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [255, 255, 255, 1],
                        width: 2
                    }),
                    radius: 12
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [255, 255, 255, 1],
                        width: 0.3
                    })
                })
            })
        ]
        return styles;
    }


    // style for highlighted
    const styleForSelect = function(feature) {
        let cityID = feature.get('ID');
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [0, 0, 0, 1]
                    }),
                    radius: 12
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [255, 255, 255, 1],
                        width: 0.5
                    })
                })
            })
        ]
        return styles;
    }


    const citiesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/cities.geojson',
        }),
        style: citiesStyle
    })
    map.addLayer(citiesLayer);

// map features click logic
    const navElements = document.querySelector('.column-navigation');
    const cityNameElement = document.getElementById('cityname');
    const cityImageElement = document.getElementById('cityimage');
    const mapView = map.getView();

    map.on('singleclick', function(evt) {
// get coordinates from map
        // console.log(evt.coordinate)
        map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            let featureName = feature.get('Cityname');
            let navElement = navElements.children.namedItem(featureName);
            // console.log(navElement);
            mainLogic(feature, navElement)
        })
    })
    function mainLogic(feature, clickedAnchorElement) {
// re-assign active class to the clicked element
        let currentActiveStyledElement = document.querySelector('.active');
        currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
        clickedAnchorElement.className = 'active';

// default style for all features
        let citiesFeatures = citiesLayer.getSource().getFeatures();
        citiesFeatures.forEach(function(feature) {
            feature.setStyle(citiesStyle);
        })

// home element - change content
        if (clickedAnchorElement.id === 'Home') {
            mapView.animate({center: centerCoordinates}, {zoom: 2})
            cityNameElement.innerHTML = 'Maailmanlistan TOP-7';
            cityImageElement.setAttribute('src', './data/City_images/Home_Image.jpg'); 
        } else {
// change view and content based on feature
            feature.setStyle(styleForSelect);
            let featureCoordinates = feature.get('geometry').getCoordinates();
            mapView.animate({center: featureCoordinates}, {zoom: 6});
            let featureName = feature.get('Cityname');
            let featureImage = feature.get('Cityimage');
            cityNameElement.innerHTML = 'Name of the city: ' + featureName;
            cityImageElement.setAttribute('src', './data/City_images/' + featureImage + '.jpg'); 
        }
    }

// navigation button logic 
    const anchorNavElements = document.querySelectorAll('.column-navigation > a');
    for (let anchorNavElement of anchorNavElements) {
        anchorNavElement.addEventListener('click', function(e) {
            let clickedAnchorElement = e.currentTarget;
            let clickedAnchorElementID = clickedAnchorElement.id;
            let citiesFeatures = citiesLayer.getSource().getFeatures();
            citiesFeatures.forEach(function(feature) {
                let featureCityName = feature.get('Cityname');
                if (clickedAnchorElementID === featureCityName) {
                    mainLogic(feature, clickedAnchorElement);
                }
            })
            if (clickedAnchorElementID === 'Home') {
                mainLogic(undefined, clickedAnchorElement);
            }
        })
    }
}