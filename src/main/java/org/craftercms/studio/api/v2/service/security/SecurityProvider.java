/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

package org.craftercms.studio.api.v2.service.security;

import org.craftercms.commons.entitlements.exception.EntitlementException;
import org.craftercms.studio.api.v1.exception.ServiceLayerException;
import org.craftercms.studio.api.v1.exception.security.AuthenticationSystemException;
import org.craftercms.studio.api.v1.exception.security.BadCredentialsException;
import org.craftercms.studio.api.v1.exception.security.GroupAlreadyExistsException;
import org.craftercms.studio.api.v1.exception.security.PasswordDoesNotMatchException;
import org.craftercms.studio.api.v1.exception.security.UserAlreadyExistsException;
import org.craftercms.studio.api.v1.exception.security.UserExternallyManagedException;
import org.craftercms.studio.api.v1.exception.security.UserNotFoundException;
import org.craftercms.studio.api.v2.dal.GroupTO;
import org.craftercms.studio.api.v2.dal.UserTO;
import org.craftercms.studio.impl.v2.service.security.Authentication;

import java.util.List;

public interface SecurityProvider {
    List<UserTO> getAllUsersForSite(long orgId, List<String> groupNames, int offset, int limit, String sort)
        throws ServiceLayerException;

    UserTO createUser(UserTO user) throws UserAlreadyExistsException, ServiceLayerException;

    void updateUser(UserTO user) throws ServiceLayerException;

    void deleteUsers(List<Long> userIds, List<String> usernames) throws ServiceLayerException;

    UserTO getUserByIdOrUsername(long userId, String username) throws ServiceLayerException, UserNotFoundException;

    List<UserTO> enableUsers(List<Long> userIds, List<String> usernames, boolean enabled)
            throws ServiceLayerException, UserNotFoundException;

    List<GroupTO> getUserGroups(long userId, String username) throws ServiceLayerException;

    List<GroupTO> getAllGroups(long orgId, int offset, int limit, String sort) throws ServiceLayerException;

    GroupTO createGroup(long orgId, String groupName, String groupDescription)
            throws GroupAlreadyExistsException, ServiceLayerException;

    GroupTO updateGroup(long orgId, GroupTO group) throws ServiceLayerException;

    void deleteGroup(List<Long> groupIds) throws ServiceLayerException;

    GroupTO getGroup(long groupId) throws ServiceLayerException;

    List<UserTO> getGroupMembers(long groupId, int offset, int limit, String sort) throws ServiceLayerException;

    List<UserTO> addGroupMembers(long groupId, List<Long> userIds, List<String> usernames)
            throws ServiceLayerException, UserNotFoundException;

    void removeGroupMembers(long groupId, List<Long> userIds, List<String> usernames)
            throws ServiceLayerException, UserNotFoundException;

    int getAllUsersTotal() throws ServiceLayerException;

    String getCurrentUser();

    String authenticate(String username, String password)
            throws BadCredentialsException, AuthenticationSystemException, EntitlementException, UserNotFoundException;

    boolean validateTicket(String ticket);

    String getCurrentToken();

    Authentication getAuthentication();

    boolean logout();

    boolean changePassword(String username, String current, String newPassword)
            throws PasswordDoesNotMatchException, UserExternallyManagedException, ServiceLayerException;

    boolean setUserPassword(String username, String newPassword)
            throws UserNotFoundException, UserExternallyManagedException, ServiceLayerException;

    boolean userExists(String username) throws ServiceLayerException;

    boolean groupExists(String groupName) throws ServiceLayerException;
}
