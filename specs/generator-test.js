var should = require('should');

describe ('Genrator base object', function() {
   var Generator = require('../src/Generator');

   it ('should be defined', function() {
      should.exist(Generator);
      Generator.should.be.type('function');
   });

   it ('should expose proper interface', function() {
      var g = new Generator(5, 0, 10);

      g.should.be.type('object');
      g.should.be.an.instanceOf(Generator);
      g.should.have.property('current', 5).of.type('number');
      g.should.have.property('next').of.type('function');

      g.next().should.be.type('boolean');
   });

   it ('cannot be created without bounds', function() {
      var g;
      try {
         g = new Generator();
         should.not.exist(g); // should fail if object is created
      } catch (e) {
         e.should.have.property('message', 'Lower and Upper bounds have to be numbers');
      }

   });
});

describe ('Simple count down generator', function() {
   var CDGenerator = require('../src/CountDownGenerator');

   it ('should be defined', function() {
      CDGenerator.should.be.type('function');
   });

   it ('should count down to zero', function() {
      var counter = new CDGenerator(10);

      var expected = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
      var i = -1;

      while (++i < expected.length) {

         expected[i].should.equal(counter.current);

         var hasNext = counter.next();
         //console.log(i, 'current:', counter.current, 'has next:', hasNext);
         (expected[i] > 0).should.equal(hasNext);

      }
   });
});