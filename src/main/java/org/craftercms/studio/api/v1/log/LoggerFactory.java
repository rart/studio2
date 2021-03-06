/*******************************************************************************
 * Crafter Studio Web-content authoring solution
 *     Copyright (C) 2007-2016 Crafter Software Corporation.
 * 
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package org.craftercms.studio.api.v1.log;

import java.util.Map;


/**
 * Logger factory encapsulates a log providers and allows us to augment a provider with
 * additional features.
 * - no need to use if statements around log messages
 * - auto expansion of log formats
 * @author russdanner
 */
public class LoggerFactory {

	/** 
	 * return a list of active loggers
	 */
	public static Map<String, Logger> getLoggers() {
		return _provider.getLoggers();
	}
	
	/**
	 * set a logger's level
	 * @param name the name of the logger
	 * @param level the level to set
	 */
	public static void setLoggerLevel(String name, String level) {
		_provider.setLoggerLevel(name, level);
	}
	
	/**
	 * return a logger implementation
	 * @param target ther target class for the logger
	 */
	public static Logger getLogger(Class target) {
		Logger retLogger = null;
		
		if(_provider != null) {
			retLogger = _provider.getLogger(target);
		}
		else {
			retLogger = new ConsoleLoggerImpl();
			retLogger.warn("no log provider available");
		}
		
		return retLogger;
	}
	
	/**
	 * register provider
	 * @param provider log provider
	 */
	public static void setProvider(LogProvider provider) {
		_provider = provider;
	}
	
	protected static LogProvider _provider;
}
