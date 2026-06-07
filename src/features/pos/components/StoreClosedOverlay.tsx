/*
 * Copyright (c) 2026 Averion
 * Email: security@averion.id
 * 
 * PROPRIETARY LICENSE
 * 
 * This software is the confidential and proprietary information of Averion.
 * Unauthorized reproduction, distribution, or modification of this source code
 * is strictly prohibited.
 * 
 * WARNING: Modifying this source code without permission is a criminal offense.
 */

function StoreClosedOverlay() {
    return (
        <div className="store-closed-overlay">
            <span className="overlay-title">Welcome</span>
            <div className="overlay-message-container">
                <span className="overlay-message line-1">We're currently closed at the moment</span>
                <span className="overlay-message line-2">Check our opening hours below</span>
                <span className="overlay-message line-3">See you soon!</span>
            </div>

            {/* Store Schedule */}
            <div className="store-schedule">
                <div className="schedule-title">Opening Hours</div>
                <table className="schedule-table">
                    <tbody>
                        <tr>
                            <td className="day">Monday</td>
                            <td className="status open">Open</td>
                            <td className="time">08:00</td>
                            <td className="separator">-</td>
                            <td className="time">22:00</td>
                        </tr>
                        <tr>
                            <td className="day">Tuesday</td>
                            <td className="status open">Open</td>
                            <td className="time">08:00</td>
                            <td className="separator">-</td>
                            <td className="time">22:00</td>
                        </tr>
                        <tr>
                            <td className="day">Wednesday</td>
                            <td className="status open">Open</td>
                            <td className="time">08:00</td>
                            <td className="separator">-</td>
                            <td className="time">22:00</td>
                        </tr>
                        <tr>
                            <td className="day">Thursday</td>
                            <td className="status open">Open</td>
                            <td className="time">08:00</td>
                            <td className="separator">-</td>
                            <td className="time">22:00</td>
                        </tr>
                        <tr>
                            <td className="day">Friday</td>
                            <td className="status open">Open</td>
                            <td className="time">08:00</td>
                            <td className="separator">-</td>
                            <td className="time">23:00</td>
                        </tr>
                        <tr>
                            <td className="day">Saturday</td>
                            <td className="status open">Open</td>
                            <td className="time">09:00</td>
                            <td className="separator">-</td>
                            <td className="time">23:00</td>
                        </tr>
                        <tr>
                            <td className="day">Sunday</td>
                            <td className="status closed">Closed</td>
                            <td className="time">-</td>
                            <td className="separator">-</td>
                            <td className="time">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StoreClosedOverlay;
