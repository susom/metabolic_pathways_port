import { map } from 'ramda';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
// Removed: var Loader = require('react-loader');
import { saveAs } from 'file-saver';
import svgMap from 'assets/map.svg.inner.html';
import scaleCheckRect from 'config/scaleCheckRect';
import homeConfig from './Home.config';
import siteConfig from 'config/';
import axios from 'axios';

const { screenShotId, svgId, zoomInId, zoomOutId } = homeConfig;

const config = {
    zoomInFactor: 2,
    zoomOutFactor: 0.5,
};

const styles = {
    container: {
        display: 'flex',
        cursor: 'grab',
        flexGrow: 1,
        '&:active': {
            cursor: 'grabbing',
        },
    },
    d3Container: {
        flexGrow: 1,
        overflow: 'visible !important',
    },
};

class MapComponent extends PureComponent {
    createMap = () => {
        let svg = select(document.getElementById(svgId));
        let viewBox = svg.attr('viewBox').split(' ');
        let size = viewBox.slice(2);
        let width = size[0];
        let height = size[1];
        var active = select(null);

        const zoomOnScroll = zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', (event) => g.attr('transform', event.transform));

        const z = zoomOnScroll;

        const zoomOnButton = zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', (event) => g.attr('transform', event.transform));

        svg.call(zoomOnScroll);
        let g = svg.select('g');

        g.append('rect')
            .attr('height', scaleCheckRect.height)
            .attr('id', scaleCheckRect.id)
            .attr('width', scaleCheckRect.width)
            .attr('x', scaleCheckRect.x)
            .attr('y', scaleCheckRect.y)
            .style('opacity', scaleCheckRect.opacity);

        g.selectAll('#Color_Blocks path, #Color_Blocks polygon, #Color_Blocks rect, #Color_Blocks polyline')
            .on('click', clicked);

        select(document.getElementById(screenShotId))
            .on('click', () => {
                this.setState({ takingScreenshot: true });

                const cycleCovers = document.getElementsByClassName(
                    homeConfig.cycleCoverClass
                );

                map(ele => (ele.style = "fill: #FFF; opacity: 1;"), cycleCovers);

                // Comment out for local
                const tag = document.getElementById(svgId);
                let strSvg = tag.outerHTML;

                // Ensure xmlns:xlink is present
                if (!strSvg.includes('xmlns:xlink')) {
                    strSvg = strSvg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
                }

                console.log('Preparing to send SVG for conversion:', strSvg);
                console.log('API URL:', `${siteConfig.URL}/${siteConfig.svgEndpoint}`);

                axios
                    .post(
                        `${siteConfig.URL}/${siteConfig.svgEndpoint}`,
                        { svg: strSvg },
                        {
                            headers: { 'Content-Type': 'application/json' },
                            timeout: 60000  // Timeout set to 60 seconds
                        }
                    )
                    .then(({ data: { png } }) => {
                        console.log('Received PNG data:', png);
                        return png;
                    })
                    .then(fetch)
                    .then(res => res.blob())
                    .then(blob => saveAs(blob, siteConfig.downloadFileName))
                    .catch(error => {
                        if (error.code === 'ECONNABORTED') {
                            console.error('Request timed out');
                        } else {
                            console.error('Error during SVG conversion:', error);
                        }
                    })
                    .finally(() => {
                        this.setState({ takingScreenshot: false });
                    });

            });


        // Zoom in Button
        select(document.getElementById(zoomInId)).on('click', () =>
            zoomOnButton.scaleBy(svg, config.zoomInFactor)
        );

        // Zoom out Button
        select(document.getElementById(zoomOutId)).on('click', () =>
            zoomOnButton.scaleBy(svg, config.zoomOutFactor)
        );

        let defs = svg.append('defs');
        const mapPin = defs.append('g').attr('id', 'map-pin');

        mapPin.append('path').attr(
            'd',
            'm18 -33c0 15.7-18.3 31.8-18.3 31.8s-18.3-16.5-18.3-31.8c0-10.1 8.2-18.3 18.3-18.3s18.3 8.2 18.3 18.3z'
        );

        mapPin.append('circle').attr('r', 7.5).attr('cy', -33).attr('fill', '#FFF');

        /** 77ece89 - Removed map pins with text space, and drop shadow filter. **/

        function clicked() {
            if (active.node() === this) return reset();
            active.classed('active', false);
            active = select(this).classed('active', true);

            var box = select(this).node().getBBox();
            var dx = box.width;
            var dy = box.height;
            var x = box.x + dx / 2;
            var y = box.y + dy / 2;
            var scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
            var translate = [width / 2 - scale * x, height / 2 - scale * y];

            svg
                .transition()
                .duration(750)
                .call(z.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale));
        }

        function reset() {
            active.classed('active', false);
            active = select(null);
            svg.transition().duration(750).call(z.transform, zoomIdentity);
        }
    };

    state = {
        takingScreenshot: false,
    };

    componentDidMount() {
        this.createMap();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <svg
                    id={svgId}
                    dangerouslySetInnerHTML={{ __html: svgMap }}
                    className={classes.d3Container}
                    viewBox="0 0 4836 2412"
                />
            </div>
        );
    }
}

export default injectSheet(styles)(MapComponent);
