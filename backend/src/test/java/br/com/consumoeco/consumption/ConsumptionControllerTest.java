package br.com.consumoeco.consumption;

import br.com.consumoeco.users.User;
import br.com.consumoeco.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ConsumptionControllerTest {
    private ConsumptionRepository records;
    private UserRepository users;
    private ConsumptionController controller;
    private Authentication auth;
    private User owner;

    @BeforeEach
    void prepare() {
        records = mock(ConsumptionRepository.class);
        users = mock(UserRepository.class);
        controller = new ConsumptionController(records, users);
        auth = new UsernamePasswordAuthenticationToken("morador@exemplo.test", "n/a");
        owner = new User("Morador Exemplo", "morador@exemplo.test", "hash");
        owner.id = 7L;
        when(users.findByEmail("morador@exemplo.test")).thenReturn(Optional.of(owner));
    }

    private ConsumptionController.Input input(LocalDate month) {
        return new ConsumptionController.Input(month, new BigDecimal("12.50"),
            new BigDecimal("85.00"), new BigDecimal("180.00"), new BigDecimal("162.00"));
    }

    @Test
    void createReturns201AndPersistsValidRecord() {
        LocalDate month = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        when(records.save(any(Consumption.class))).thenAnswer(call -> {
            Consumption c = call.getArgument(0);
            c.id = 12L;
            return c;
        });
        var response = controller.create(input(month), auth);
        assertEquals(201, response.getStatusCode().value());
        assertEquals(12L, response.getBody().id());
        assertEquals(new BigDecimal("180.00"), response.getBody().energyKwh());
        verify(records).save(any(Consumption.class));
    }

    @Test
    void rejectsDuplicateMonth() {
        LocalDate month = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        when(records.existsByOwnerIdAndMonth(7L, month)).thenReturn(true);
        var ex = assertThrows(ResponseStatusException.class, () -> controller.create(input(month), auth));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        verify(records, never()).save(any());
    }

    @Test
    void rejectsDayOtherThanFirst() {
        LocalDate invalid = LocalDate.now().minusMonths(1).withDayOfMonth(2);
        var ex = assertThrows(ResponseStatusException.class, () -> controller.create(input(invalid), auth));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void rejectsFutureMonth() {
        LocalDate future = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        var ex = assertThrows(ResponseStatusException.class, () -> controller.create(input(future), auth));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void listOnlyRequestsAuthenticatedOwnersRecords() {
        when(records.findAllByOwnerIdOrderByMonthAsc(7L)).thenReturn(List.of());
        assertTrue(controller.list(auth).isEmpty());
        verify(records).findAllByOwnerIdOrderByMonthAsc(7L);
    }

    @Test
    void updateCannotChangeUnknownOrOtherUsersRecord() {
        when(records.findByIdAndOwnerId(999L, 7L)).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
            () -> controller.update(999L, input(LocalDate.now().withDayOfMonth(1)), auth));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deleteCannotRemoveUnknownOrOtherUsersRecord() {
        when(records.findByIdAndOwnerId(999L, 7L)).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
            () -> controller.delete(999L, auth));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        verify(records, never()).delete(any());
    }
}
